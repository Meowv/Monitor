var time_from = "";
var time_till = "";

layui.use(['laydate'], function () {
    var laydate = layui.laydate;

    laydate.render({
        elem: '#range'
        , type: 'datetime'
        , range: true,
        done: function (value) {
            if (value.length > 0) {
                var time = value.split(' - ');

                time_from = time[0];
                time_till = time[1];
            } else {
                time_from = "";
                time_till = "";
            }

            renderCharts(time_from, time_till);

            range_menu.close();
        }
    });

    $('.ranges a').click(function () {
        var range = $(this).data("range");
        getRangeDate(range);

        renderCharts(time_from, time_till);

        range_menu.close();
    });

    function getRangeDate(range) {
        var now = new Date;
        var arr = range.split('|');

        if (arr[1] == "m") {
            now.setMinutes(now.getMinutes() - arr[0]);
            time_from = now.format();
            time_till = new Date().format();
        } else if (arr[1] == "h") {
            now.setHours(now.getHours() - arr[0]);
            time_from = now.format();
            time_till = new Date().format();
        } else {
            time_from = "";
            time_till = "";
        }
    }
});

Date.prototype.format = function () {
    var fmt = "yyyy-MM-dd hh:mm:ss";
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

//图表刷新时间
const refreshTime = 60000;
//菜单配置
const nav_menu = new mSlider({
    dom: ".nav-menu",
    direction: "right",
    distance: "20%",
});
const range_menu = new mSlider({
    dom: ".range-menu",
    direction: "top",
    distance: "100px",
});
//加载中
let loading = {};
//当前主题
let theme = '';

let charts = [];
let charts_data = [];

getCharts();
loadChartsHtml();
resetChartsHeight();
setTheme();
setThemeOptions();
setRangeOptions();
setInterval(getTime, 1000);
setInterval(reloadCharts, refreshTime);

function getCharts() {
    $.ajax({
        type: 'get',
        url: '/api/Charts/get_charts?count=6',
        dataType: 'json',
        async: false,
        success: function (result) {
            charts_data = result.data;
        }
    });
}

//菜单点击事件
$('.nav-bar span:eq(0)').click(function () {
    range_menu.open();
});
$('.nav-bar span:eq(1)').click(function () {
    nav_menu.open();
});

//监听窗口变化
window.addEventListener("resize", function () {
    resetChartsHeight();
    for (var i = 0; i < charts_data.length; i++) {
        charts[i].resize();
    }
});

//切换主题
$('.theme').on('click', 'a', function () {
    let theme = $(this).attr('title');
    if (theme == getCookie('.AspNetCore.Theme')) {
        return false;
    }
    addCookie('.AspNetCore.Theme', theme);
    setTheme();
});

//全屏查看
$('.nav-bar span:eq(2)').click(function () {
    var ele = document.documentElement;
    var SCREEN_FULL_TEXT = "全屏";
    var SCREEN_REST_TEXT = "退出全屏";
    var SCREEN_FULL = 'layui-icon-screen-full';
    var SCREEN_REST = 'layui-icon-screen-restore';
    var iconElem = $(this).children("i");
    if (iconElem.hasClass(SCREEN_FULL)) {
        var reqFullScreen = ele.requestFullScreen || ele.webkitRequestFullScreen || ele.mozRequestFullScreen || ele.msRequestFullscreen;
        if (typeof reqFullScreen !== 'undefined' && reqFullScreen) {
            reqFullScreen.call(ele);
        };
        iconElem.addClass(SCREEN_REST).removeClass(SCREEN_FULL);
        $('.nav-bar span:eq(2)').attr('title', SCREEN_REST_TEXT);
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        iconElem.addClass(SCREEN_FULL).removeClass(SCREEN_REST);
        $('.nav-bar span:eq(2)').attr('title', SCREEN_FULL_TEXT);
    }
});

//加载图表容器
function loadChartsHtml() {
    var html = '';
    for (var i = 0; i < charts_data.length; i++) {
        html += "<div class=\"layui-col-md4 layui-col-md4 layui-col-md4\">";
        html += "<div class=\"charts\" id=\"" + charts_data[i].chartsId + "\"></div>";
        html += "</div>";
    }
    $('.content .layui-row').html(html);

    for (var i = 0; i < charts_data.length; i++) {
        charts.push("charts" + (i + 1));
        charts[i] = echarts.init(document.getElementById("charts" + (i + 1)));
    }
}

//重置图表高度
function resetChartsHeight() {
    $('.charts').css("height", ($('.content').height() / 2) + "px");
    $('.charts>div').css("height", ($('.content').height() / 2) + "px");
}

//返回实时时间
function getTime() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    var day = date.getDate();
    day = day < 10 ? '0' + day : day;
    var hour = date.getHours();
    hour = hour < 10 ? '0' + hour : hour;
    var minute = date.getMinutes();
    minute = minute < 10 ? '0' + minute : minute;
    var second = date.getSeconds();
    second = second < 10 ? '0' + second : second;
    var time = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    $('.nav-bar span:eq(4)').html(time);
}

//添加cookie
function addCookie(name, value) {
    const day = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + day * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

//获取cookie
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else return null;
}

//设置主题
function setTheme() {
    theme = getCookie('.AspNetCore.Theme') || 'dark';
    if (theme != 'dark') {
        $('.nav-header-brand img').attr('src', '/imgs/logo_white.png');
    } else {
        $('.nav-header-brand img').attr('src', '/imgs/logo_black.png');
    }
    $.getJSON('js/themes/' + theme + '.json', function (result) {
        disposeCharts();
        echarts.registerTheme(theme, result.theme);

        loading = result.loading;
        const style = result.style;
        $('body').css({
            "background-image": style.backgroundImage,
            "background-color": style.backgroundColor
        });
        $('.nav').css("color", style.color);
        $('.nav-header-brand img').attr("src", style.logo);

        renderCharts(time_from, time_till);
    });
}

//释放实例
function disposeCharts() {
    for (var i = 0; i < charts.length; i++) {
        charts[i].dispose();
    }
}

//重载图表
function reloadCharts() {
    disposeCharts();
    renderCharts(time_from, time_till);
}

//设置主题选项
function setThemeOptions() {
    $('.nav-menu').removeClass("layui-hide");
    var html = "";
    $.getJSON('js/themes/themes.json', function (result) {
        for (var value of result.themes) {
            html += "<div class=\"layui-col-md12 layui-col-md12 layui-col-md12\">";
            html += "<a class=\"theme-plan-group\" title=\"" + value.name + "\" style=\"background-color: " + value.background + ";\">";
            for (var i = 0; i < value.theme.length; i++) {
                html += "<div class=\"theme-plan-color\" style=\"background-color:" + value.theme[i] + " ;\"></div>";
            }
            html += "</a>";
            html += "</div>";
        }
        $('.theme>div').html(html);
    });
}

function setRangeOptions() {
    $('.range-menu').removeClass("layui-hide");
    var html = "";
    var data = [
        {
            "name": "Last 5 minutes",
            "range": "5|m"
        }, {
            "name": "Last 15 minutes",
            "range": "15|m"
        }
        , {
            "name": "Last 30 minutes",
            "range": "30|m"
        }
        , {
            "name": "Last 1 hours",
            "range": "1|h"
        }
        , {
            "name": "Last 3 hours",
            "range": "3|h"
        }
        , {
            "name": "Last 6 hours",
            "range": "6|h"
        }
        , {
            "name": "Last 12 hours",
            "range": "12|h"
        }
        , {
            "name": "Last 24 hours",
            "range": "24|h"
        }
    ];
    for (var value of data) {
        html += "<a href=\"javascript:;\" data-range=\"" + value.range + "\" class=\"layui-btn layui-btn-primary layui-btn-sm\">" + value.name + "</a>";
    }
    $('.ranges').html(html);
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

//渲染图表
function renderCharts(time_from, time_till) {
    for (var i = 0; i < charts_data.length; i++) {
        charts[i] = echarts.init(document.getElementById("charts" + (i + 1)), theme);
        charts[i].showLoading(loading);

        if (time_from == "") {
            time_from = charts_data[i].timeForm;
        }
        if (time_till == "") {
            time_till = charts_data[i].timeTill;
        }

        var url = "/api/Zabbix/history?itemids=" + charts_data[i].itemId + "&time_from=" + time_from + "&time_till=" + time_till;

        var itemName = charts_data[i].itemName;

        getChartsData(url, itemName, i);
    }
}

var getChartsData = function (url, itemName, i) {
    $.getJSON(url, function (data) {
        var option = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: [itemName]
            },
            xAxis: {
                data: data.result.map(function (item) {
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
                data: data.result.map(function (item) {
                    return item.value;
                })
            }
        };
        charts[i].setOption(option);
        charts[i].hideLoading();
    });
}