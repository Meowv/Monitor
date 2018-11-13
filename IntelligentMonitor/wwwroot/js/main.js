//图表刷新时间
const refreshTime = 60000;
//菜单配置
const _menu = new mSlider({
    dom: ".nav-menu",
    direction: "right",
    distance: "20%",
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
$('.nav-time span:eq(0)').click(function () {
    _menu.open();
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
$('.nav-time span:eq(1)').click(function () {
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
        $('.nav-time span:eq(1)').attr('title', SCREEN_REST_TEXT);
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
        $('.nav-time span:eq(1)').attr('title', SCREEN_FULL_TEXT);
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
    $('.nav-time span:eq(3)').html("当前时间：" + time);
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

        renderCharts();
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
    renderCharts();
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

//渲染图表
function renderCharts() {
    for (var i = 0; i < charts_data.length; i++) {
        charts[i] = echarts.init(document.getElementById("charts" + (i + 1)), theme);
        charts[i].showLoading(loading);

        var url = "/api/Zabbix/history?itemids=" + charts_data[i].itemId + "&time_from=" + charts_data[i].timeForm + "&time_till=" + charts_data[i].timeTill;

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