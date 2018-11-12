if (getCookie(".AspNetCore.Tip") != "no") {
    layui.use(['layer'], function () {
        var layer = layui.layer;
        var index = layer.msg('请拖动图表进行排序，前台只展示前6个！', {
            time: 5000
            , btn: ['知道了']
            , yes: function () {
                layer.close(index);
                addCookie(".AspNetCore.Tip", "no");
            }
        });
    });
}

var deleteCharts;
layui.use(['layer'], function () {
    var layer = layui.layer;

    deleteCharts = function (id, title,e) {
        layer.confirm('确认删除此图表？', {
            title: title,
            btn: ['确认', '取消']
        }, function () {
            $.ajax({
                type: "post",
                url: "/api/Charts/delete_charts",
                contentType: "application/json; charset=utf-8",
                data: "\"" + id + "\"",
                success: function (result) {
                    if (result.code == 0) {
                        layer.msg(result.msg, {
                            icon: 1,
                            time: 1000
                        }, function () {
                            $('.qix_' + e).remove();
                        });
                    }
                }
            });
        }, function () {
            layer.close();
        });
    }
});

const refreshTime = 60000;
let loading = {};
let theme = 'shine';
let charts = [];
let charts_data = [];

getCharts();
loadChartsHtml();
setTheme();
setInterval(reloadCharts, refreshTime);

function getCharts() {
    $.ajax({
        type: 'get',
        url: '/api/Charts/get_charts',
        dataType: 'json',
        async: false,
        success: function (result) {
            charts_data = result.data;
        }
    });
}

$('.layui-fluid .layui-row').dad({
    draggable: '.layui-card-header span',
    callback: function () {
        var chartsId = [];
        $('.layui-fluid .layui-row .dads-children').each(function (index, value) {
            var item = $(this).data("id");
            chartsId.push(item);
        });
        $.ajax({
            type: "post",
            url: "/api/Charts/update_charts",
            contentType: "application/json; charset=utf-8",
            data: "\"" + chartsId.join(',') + "\"",
            success: function (result) {
                console.log(result);
            }
        });
    }
});

window.addEventListener("resize", function () {
    for (var i = 0; i < charts_data.length; i++) {
        charts[i].resize();
    }
});

function loadChartsHtml() {
    var html = '';
    for (var i = 0; i < charts_data.length; i++) {
        html += "<div data-id=\"" + charts_data[i].id + "\" class=\"layui-col-md4 layui-col-md4 layui-col-md4 qix_" + charts_data[i].chartsId + "\">";
        html += "<div class=\"layui-card\">";
        html += "<div style=\"font-size:12px;line-height:22px;\" class=\"layui-card-header layui-elip\"><span>" + charts_data[i].chartsName + "</span><i title=\"删除此图表\" class=\"layui-icon layui-icon-delete\" onclick=\"deleteCharts('" + charts_data[i].id + "','" + charts_data[i].chartsName + "','" + charts_data[i].chartsId + "')\" style=\"font-size: 20px;cursor:pointer;\"></i></div>";
        html += "<div class=\"layui-card-body\">";
        html += "<div class=\"layui-carousel charts\" id=\"" + charts_data[i].chartsId + "\"></div>";
        html += "</div>";
        html += "</div>";
        html += "</div>";
    }
    $('.layui-fluid .layui-row').html(html);

    for (var i = 0; i < charts_data.length; i++) {
        charts.push("charts" + (i + 1));
        charts[i] = echarts.init(document.getElementById("charts" + (i + 1)));
    }

    $('.charts').css("height", "250px");
    $('.charts>div').css("height", "250px");
}

function reloadCharts() {
    disposeCharts();
    renderCharts();
}

function setTheme() {
    $.getJSON('/js/themes/' + theme+'.json', function (result) {
        disposeCharts();
        echarts.registerTheme(theme, result.theme);

        loading = result.loading;

        renderCharts();
    });
}

function addCookie(name, value) {
    const day = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + day * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else return null;
}

function disposeCharts() {
    for (var i = 0; i < charts.length; i++) {
        charts[i].dispose();
    }
}

function format(unix) {
    var time = new Date(unix * 1000);
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return m + '/' + d + ' ' + h + ':' + mm;
}

function renderCharts() {
    for (var i = 0; i < charts_data.length; i++) {
        charts[i] = echarts.init(document.getElementById("charts" + (i + 1)), theme);
        charts[i].showLoading(loading);

        var url = "/api/Zabbix/history?itemids=" + charts_data[i].itemId + "&time_from=" + charts_data[i].timeForm + "&time_till=" + charts_data[i].timeTill;
        var chartsdata;
        $.ajax({
            type: 'get',
            url: url,
            dataType: 'json',
            async: false,
            success: function (data) {
                chartsdata = data.result;
            }
        });

        var itemName = charts_data[i].itemName;

        var option = {
            backgroundColor: '#fff',
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: [itemName]
            },
            xAxis: {
                data: chartsdata.map(function (item) {
                    return format(item.clock);
                })
            },
            yAxis: {
                splitLine: {
                    show: false
                }
            },
            series: {
                name: itemName,
                type: 'line',
                data: chartsdata.map(function (item) {
                    return item.value;
                })
            }
        };

        charts[i].setOption(option);
        charts[i].hideLoading();
    }
}