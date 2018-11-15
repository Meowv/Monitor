layui.use(['form', 'layer'], function () {
    var form = layui.form
        , layer = layui.layer

    $('.layui-form-item .layui-form-label').css("width", "auto");

    var _hostName = "";
    var _itemName = "";
    let itemName = [];
    let itemid = [];
    let loading = {};
    let theme = 'shine';
    let charts = echarts.init(document.getElementById("charts"));

    let queryhtml = $('.query>div').prop("outerHTML");

    renderCharts([], [], []);
    $.getJSON('/js/themes/' + theme + '.json', function (result) {
        echarts.registerTheme(theme, result.theme);
        loading = result.loading;
    });

    $.getJSON("/api/Zabbix/hostgroup", function (data) {
        var options = "<option value=\"\"></option>";
        for (var i = 0; i < data.result.length; i++) {
            options += "<option value=\"" + data.result[i].groupid + "\">" + data.result[i].name + "</option>";
        }
        $('.group').html(options);
        form.render('select');
    });

    $(".query").delegate(".btnQuery", "click", function () {
        $('.query').append(queryhtml);
        var group = $(this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.lastChild).find(".group");

        $.getJSON("/api/Zabbix/hostgroup", function (data) {
            var options = "<option value=\"\"></option>";
            for (var i = 0; i < data.result.length; i++) {
                options += "<option value=\"" + data.result[i].groupid + "\">" + data.result[i].name + "</option>";
            }
            group.html(options);
            form.render('select');
        });

        $(this).parent().parent().find("div:eq(0)").removeClass("layui-hide");
        $(this).parent().parent().find("div:gt(0)").remove();
    });

    function deleteArr(arr, idx) {
        var array = [];
        for (var i = 0; i < arr.length; i++) {
            if (i != idx) {
                array.push(arr[i]);
            }
        }
        return array;
    }

    $(".query").delegate(".btnRemoveQuery", "click", function () {
        var idx = $(".btnRemoveQuery").index(this);
        $(this.parentNode.parentNode.parentNode.parentNode.parentNode).remove();

        itemName = deleteArr(itemName, idx);
        itemid = deleteArr(itemid, idx);

        getData(itemid, itemName);
    });

    form.on('select', function (data) {
        var elem = $(data.elem);
        var elemDad = elem.parent().parent().parent().parent().parent();
        var g = elem.hasClass("group");
        var h = elem.hasClass("host");
        var a = elem.hasClass("application");
        var i = elem.hasClass("item");
        if (g) {
            $.getJSON("/api/Zabbix/host?groupids=" + data.value, function (data) {
                var options = "<option value=\"\"></option>";
                for (var i = 0; i < data.result.length; i++) {
                    options += "<option value=\"" + data.result[i].hostid + "\">" + data.result[i].name + "</option>";
                }
                elemDad.find('.host').html(options);
                form.render('select');
            });
        }
        if (h) {
            _hostName = $(this).text();
            $.getJSON("/api/Zabbix/application?hostids=" + data.value, function (data) {
                var options = "<option value=\"\"></option>";
                for (var i = 0; i < data.result.length; i++) {
                    options += "<option value=\"" + data.result[i].applicationid + "\">" + data.result[i].name + "</option>";
                }
                elemDad.find('.application').html(options);
                form.render('select');
            });
        }
        if (a) {
            $.getJSON("/api/Zabbix/item?applicationids=" + data.value, function (data) {
                var options = "<option value=\"\"></option>";
                for (var i = 0; i < data.result.length; i++) {
                    var name = data.result[i].name;
                    if (name.indexOf('$') >= 0) {
                        var key = data.result[i].key_;
                        var keys = key.match(/\[(.+?)\]/g)[0].replace("[", "").replace("]", "").split(',');
                        for (var j = 0; j < keys.length; j++) {
                            name = name.replace("$" + (j + 1), keys[j]);
                        }
                    }
                    options += "<option value=\"" + data.result[i].itemid + "\">" + name + "</option>";
                }
                elemDad.find('.item').html(options);
                form.render('select');
            });
        }
        if (i) {
            _itemName = _hostName + "_" + $(this).text();

            var id = elemDad.find('.itemId').val();
            var index = function (item) {
                return item == id;
            }

            if (id > 0) {
                var idx = itemid.findIndex(index);
                itemid[idx] = data.value;
                itemName[idx] = _itemName;
            } else {
                itemid.push(data.value);
                itemName.push(_itemName);
            }

            _itemName = "";
            elemDad.find('.itemId').val(data.value);

            charts.showLoading(loading);

            getData(itemid, itemName);
        }
    });

    form.on('submit(save)', function (data) {
        if (itemName.length > 0 && itemid.length > 0) {
            layer.prompt({
                title: '请输入此图表名称'
                , formType: 0
            }, function (chartsName, index) {
                layer.close(index);
                //var time = $('#range').val().split(' - ');
                var time_from = "";
                var time_till = "";
                var charts = {};
                charts.itemId = itemid.join(",");
                charts.timeFrom = time_from;
                charts.timeTill = time_till;
                charts.itemName = itemName.join(",");
                charts.chartsName = chartsName;

                $.ajax({
                    type: "post",
                    url: "/api/Charts/add_charts",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify(charts),
                    success: function (result) {
                        if (result.code == 0) {
                            layer.msg(result.msg, {
                                icon: 1,
                                time: 1000
                            }, function () {
                                window.location.reload();
                            });
                        } else {
                            layer.msg(result.msg, {
                                icon: 5,
                                time: 1000
                            });
                        }
                    }
                });
            });
        } else {
            layer.msg("无监控数据，不可保存");
        }
        return false;
    });

    function getData(itemid, itemName) {
        var url = "/api/Zabbix/history?";

        for (var i = 0; i < itemid.length; i++) {
            url += "&itemids=" + itemid[i];
        }
        $.getJSON(url, function (data) {
            var series_data = [];
            var res = data.result;

            for (var i = 0; i < itemid.length; i++) {
                var xAxis_data = [];
                var value = [];

                res.map(function (item) {
                    if (item.itemid == itemid[i]) {
                        value.push(item.value);
                        xAxis_data.push(format(item.clock));
                    }
                })
                var item = {
                    name: itemName[i],
                    type: 'line',
                    data: value
                };
                series_data.push(item);
            }

            renderCharts(series_data, xAxis_data, itemName);
        });
    }

    function renderCharts(series_data, xAxis_data, itemName) {
        charts.clear();
        let option = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: itemName
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: xAxis_data
            },
            yAxis: {
                splitLine: {
                    show: true
                },
                type: 'log'
            },
            series: series_data
        };

        charts.setOption(option);
        charts.hideLoading();
    }

    function format(unix) {
        var now = new Date();
        var time = new Date(unix * 1000);
        //var y = time.getFullYear();
        var m = time.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        var d = time.getDate();
        d = d < 10 ? '0' + d : d;
        var h = time.getHours();
        h = h < 10 ? '0' + h : h;
        var mm = time.getMinutes();
        mm = mm < 10 ? '0' + mm : mm;
        //var s = time.getSeconds();
        var now_m = now.getMonth() + 1;
        now_m = now_m < 10 ? '0' + now_m : now_m;
        var now_d = now.getDate();
        now_d = now_d < 10 ? '' + now_d : now_d;
        if (m == now_m && d == now_d) {
            return h + ':' + mm;
        }
        return m + '/' + d + ' ' + h + ':' + mm;
    }

    window.addEventListener("resize", function () {
        charts.resize();
    });
});