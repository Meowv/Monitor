//菜单配置
const _menu = new mSlider({
    dom: ".nav-menu",
    direction: "right",
    distance: "20%",
});

//图表加载配置
const loading = {
    text: '加载中...',
    color: '#fff',
    textColor: '#fff',
    maskColor: 'rgba(51, 51, 51, 0.1)',
    zlevel: 0
};

//图表刷新时间
const refreshTime = 60000;
//当前主题
let theme = '';
let charts1 = echarts.init(document.getElementById('charts1'));
let charts2 = echarts.init(document.getElementById('charts2'));
let charts3 = echarts.init(document.getElementById('charts3'));
let charts4 = echarts.init(document.getElementById('charts4'));
let charts5 = echarts.init(document.getElementById('charts5'));
let charts6 = echarts.init(document.getElementById('charts6'));

resetChartsHeight();
init();
setInterval(getTime, 1000);
setInterval(reloadCharts, refreshTime);

//重置图表高度
function resetChartsHeight() {
    $('.charts').css("height", ($('.content').height() / 2) + "px");
    $('.charts>div').css("height", ($('.content').height() / 2) + "px");
}

//初始化
function init() {
    $('.nav-menu').removeClass("layui-hide");
    getTime();
    setTheme();
    setThemeOptions();
}

//返回实时时间
function getTime() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    second = second < 10 ? '0' + second : second;
    var time = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    $('.nav-time span:eq(2)').html("当前时间：" + time);
}

//切换主题
$('.theme').on('click', 'a', function () {
    let theme = $(this).attr('title');
    if (theme == getCookie('.AspNetCore.Theme')) {
        return false;
    }
    addCookie('.AspNetCore.Theme', theme);
    setTheme();
});

//菜单点击事件
$('.nav-time span:eq(0)').click(function () {
    _menu.open();
});

//监听窗口变化
window.addEventListener("resize", function () {
    resetChartsHeight();
    charts1.resize();
    charts2.resize();
    charts3.resize();
    charts4.resize();
    charts5.resize();
    charts6.resize();
});

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
        $('body').removeClass('blackbg');
        $('body').addClass('whitebg');
    } else {
        $('body').addClass('blackbg');
        $('body').removeClass('whitebg');
    }
    $.getJSON('js/themes/' + theme + '.json', function (result) {
        disposeCharts();
        echarts.registerTheme(theme, result);
        renderCharts1(theme);
        renderCharts2(theme);
        renderCharts3(theme);
        renderCharts4(theme);
        renderCharts5(theme);
        renderCharts6(theme);
    });
}

//释放实例
function disposeCharts() {
    charts1.dispose();
    charts2.dispose();
    charts3.dispose();
    charts4.dispose();
    charts5.dispose();
    charts6.dispose();
}

//重载图表
function reloadCharts() {
    disposeCharts();
    renderCharts1(theme);
    renderCharts2(theme);
    renderCharts3(theme);
    renderCharts4(theme);
    renderCharts5(theme);
    renderCharts6(theme);
}

//设置主题选项
function setThemeOptions() {
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

function renderCharts1(theme) {
    charts1 = echarts.init(document.getElementById('charts1'), theme);
    charts1.showLoading(loading);
    let option = {
        title: {
            text: ''
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
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
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: '邮件营销',
                type: 'line',
                stack: '总量',
                data: [120, 132, 101, 134, 90, 230, 210]
            },
            {
                name: '联盟广告',
                type: 'line',
                stack: '总量',
                data: [220, 182, 191, 234, 290, 330, 310]
            },
            {
                name: '视频广告',
                type: 'line',
                stack: '总量',
                data: [150, 232, 201, 154, 190, 330, 410]
            },
            {
                name: '直接访问',
                type: 'line',
                stack: '总量',
                data: [320, 332, 301, 334, 390, 330, 320]
            },
            {
                name: '搜索引擎',
                type: 'line',
                stack: '总量',
                data: [820, 932, 901, 934, 1290, 1330, 1320]
            }
        ]
    };
    charts1.setOption(option);
    charts1.hideLoading();
}
function renderCharts2(theme) {
    charts2 = echarts.init(document.getElementById('charts2'), theme);
    charts2.showLoading(loading);
    let option = {};
    charts2.setOption(option);
    //charts2.hideLoading();
}
function renderCharts3(theme) {
    charts3 = echarts.init(document.getElementById('charts3'), theme);
    charts3.showLoading(loading);
    let option = {};
    charts3.setOption(option);
    //charts3.hideLoading();
}
function renderCharts4(theme) {
    charts4 = echarts.init(document.getElementById('charts4'), theme);
    charts4.showLoading(loading);
    let option = {};
    charts4.setOption(option);
    //charts4.hideLoading();
}
function renderCharts5(theme) {
    charts5 = echarts.init(document.getElementById('charts5'), theme);
    charts5.showLoading(loading);
    let option = {};
    charts5.setOption(option);
    //charts5.hideLoading();
}
function renderCharts6(theme) {
    charts6 = echarts.init(document.getElementById('charts6'), theme);
    charts6.showLoading(loading);
    let option = {};
    charts6.setOption(option);
    //charts6.hideLoading();
}