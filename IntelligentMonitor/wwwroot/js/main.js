const refreshTime = 10000;//图表刷新时间
let loading = {};//加载配置
let theme = '';//当前主题

const chartsIds = ['charts1', 'charts2', 'charts3', 'charts4', 'charts5', 'charts6'];
loadChartsHtml();
resetChartsHeight();
setTheme();
setThemeOptions();
setInterval(getTime, 1000);
setInterval(reloadCharts, refreshTime);

let charts1 = echarts.init(document.getElementById(chartsIds[0]));
let charts2 = echarts.init(document.getElementById(chartsIds[1]));
let charts3 = echarts.init(document.getElementById(chartsIds[2]));
let charts4 = echarts.init(document.getElementById(chartsIds[3]));
let charts5 = echarts.init(document.getElementById(chartsIds[4]));
let charts6 = echarts.init(document.getElementById(chartsIds[5]));

const _menu = new mSlider({
    dom: ".nav-menu",
    direction: "right",
    distance: "20%",
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
    for (var i = 0; i < chartsIds.length; i++) {
        html += "<div class=\"layui-col-md4 layui-col-md4 layui-col-md4\">";
        html += "<div class=\"charts\" id=\"" + chartsIds[i] + "\"></div>";
        html += "</div>";
    }
    $('.content .layui-row').html(html);
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
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
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

function renderCharts1(theme) {
    charts1 = echarts.init(document.getElementById('charts1'), theme);
    charts1.showLoading(loading);

    let option = {
        tooltip: {
            trigger: 'axis'
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

    let option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '直接访问',
                type: 'bar',
                data: [320, 332, 301, 334, 390, 330, 320]
            },
            {
                name: '邮件营销',
                type: 'bar',
                stack: '广告',
                data: [120, 132, 101, 134, 90, 230, 210]
            },
            {
                name: '联盟广告',
                type: 'bar',
                stack: '广告',
                data: [220, 182, 191, 234, 290, 330, 310]
            },
            {
                name: '视频广告',
                type: 'bar',
                stack: '广告',
                data: [150, 232, 201, 154, 190, 330, 410]
            },
            {
                name: '搜索引擎',
                type: 'bar',
                data: [862, 1018, 964, 1026, 1679, 1600, 1570],
                markLine: {
                    lineStyle: {
                        normal: {
                            type: 'dashed'
                        }
                    },
                    data: [
                        [{ type: 'min' }, { type: 'max' }]
                    ]
                }
            },
            {
                name: '百度',
                type: 'bar',
                barWidth: 5,
                stack: '搜索引擎',
                data: [620, 732, 701, 734, 1090, 1130, 1120]
            },
            {
                name: '谷歌',
                type: 'bar',
                stack: '搜索引擎',
                data: [120, 132, 101, 134, 290, 230, 220]
            },
            {
                name: '必应',
                type: 'bar',
                stack: '搜索引擎',
                data: [60, 72, 71, 74, 190, 130, 110]
            },
            {
                name: '其他',
                type: 'bar',
                stack: '搜索引擎',
                data: [62, 82, 91, 84, 109, 110, 120]
            }
        ]
    };
    
    charts2.setOption(option);
    charts2.hideLoading();
}
function renderCharts3(theme) {
    charts3 = echarts.init(document.getElementById('charts3'), theme);
    charts3.showLoading(loading);

    let option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: function (params) {
                var tar;
                if (params[1].value != '-') {
                    tar = params[1];
                }
                else {
                    tar = params[0];
                }
                return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            splitLine: { show: false },
            data: function () {
                var list = [];
                for (var i = 1; i <= 11; i++) {
                    list.push('11月' + i + '日');
                }
                return list;
            }()
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: '辅助',
                type: 'bar',
                stack: '总量',
                itemStyle: {
                    normal: {
                        barBorderColor: 'rgba(0,0,0,0)',
                        color: 'rgba(0,0,0,0)'
                    },
                    emphasis: {
                        barBorderColor: 'rgba(0,0,0,0)',
                        color: 'rgba(0,0,0,0)'
                    }
                },
                data: [0, 900, 1245, 1530, 1376, 1376, 1511, 1689, 1856, 1495, 1292]
            },
            {
                name: '收入',
                type: 'bar',
                stack: '总量',
                label: {
                    normal: {
                        show: true,
                        position: 'top'
                    }
                },
                data: [900, 345, 393, '-', '-', 135, 178, 286, '-', '-', '-']
            },
            {
                name: '支出',
                type: 'bar',
                stack: '总量',
                label: {
                    normal: {
                        show: true,
                        position: 'bottom'
                    }
                },
                data: ['-', '-', '-', 108, 154, '-', '-', '-', 119, 361, 203]
            }
        ]
    };

    charts3.setOption(option);
    charts3.hideLoading();
}
function renderCharts4(theme) {
    charts4 = echarts.init(document.getElementById('charts4'), theme);
    charts4.showLoading(loading);

    var hours = ['12a', '1a', '2a', '3a', '4a', '5a', '6a',
        '7a', '8a', '9a', '10a', '11a',
        '12p', '1p', '2p', '3p', '4p', '5p',
        '6p', '7p', '8p', '9p', '10p', '11p'];
    var days = ['Saturday', 'Friday', 'Thursday',
        'Wednesday', 'Tuesday', 'Monday', 'Sunday'];
    var data = [[0, 0, 5], [0, 1, 1], [0, 2, 0], [0, 3, 0], [0, 4, 0], [0, 5, 0], [0, 6, 0], [0, 7, 0], [0, 8, 0], [0, 9, 0], [0, 10, 0], [0, 11, 2], [0, 12, 4], [0, 13, 1], [0, 14, 1], [0, 15, 3], [0, 16, 4], [0, 17, 6], [0, 18, 4], [0, 19, 4], [0, 20, 3], [0, 21, 3], [0, 22, 2], [0, 23, 5], [1, 0, 7], [1, 1, 0], [1, 2, 0], [1, 3, 0], [1, 4, 0], [1, 5, 0], [1, 6, 0], [1, 7, 0], [1, 8, 0], [1, 9, 0], [1, 10, 5], [1, 11, 2], [1, 12, 2], [1, 13, 6], [1, 14, 9], [1, 15, 11], [1, 16, 6], [1, 17, 7], [1, 18, 8], [1, 19, 12], [1, 20, 5], [1, 21, 5], [1, 22, 7], [1, 23, 2], [2, 0, 1], [2, 1, 1], [2, 2, 0], [2, 3, 0], [2, 4, 0], [2, 5, 0], [2, 6, 0], [2, 7, 0], [2, 8, 0], [2, 9, 0], [2, 10, 3], [2, 11, 2], [2, 12, 1], [2, 13, 9], [2, 14, 8], [2, 15, 10], [2, 16, 6], [2, 17, 5], [2, 18, 5], [2, 19, 5], [2, 20, 7], [2, 21, 4], [2, 22, 2], [2, 23, 4], [3, 0, 7], [3, 1, 3], [3, 2, 0], [3, 3, 0], [3, 4, 0], [3, 5, 0], [3, 6, 0], [3, 7, 0], [3, 8, 1], [3, 9, 0], [3, 10, 5], [3, 11, 4], [3, 12, 7], [3, 13, 14], [3, 14, 13], [3, 15, 12], [3, 16, 9], [3, 17, 5], [3, 18, 5], [3, 19, 10], [3, 20, 6], [3, 21, 4], [3, 22, 4], [3, 23, 1], [4, 0, 1], [4, 1, 3], [4, 2, 0], [4, 3, 0], [4, 4, 0], [4, 5, 1], [4, 6, 0], [4, 7, 0], [4, 8, 0], [4, 9, 2], [4, 10, 4], [4, 11, 4], [4, 12, 2], [4, 13, 4], [4, 14, 4], [4, 15, 14], [4, 16, 12], [4, 17, 1], [4, 18, 8], [4, 19, 5], [4, 20, 3], [4, 21, 7], [4, 22, 3], [4, 23, 0], [5, 0, 2], [5, 1, 1], [5, 2, 0], [5, 3, 3], [5, 4, 0], [5, 5, 0], [5, 6, 0], [5, 7, 0], [5, 8, 2], [5, 9, 0], [5, 10, 4], [5, 11, 1], [5, 12, 5], [5, 13, 10], [5, 14, 5], [5, 15, 7], [5, 16, 11], [5, 17, 6], [5, 18, 0], [5, 19, 5], [5, 20, 3], [5, 21, 4], [5, 22, 2], [5, 23, 0], [6, 0, 1], [6, 1, 0], [6, 2, 0], [6, 3, 0], [6, 4, 0], [6, 5, 0], [6, 6, 0], [6, 7, 0], [6, 8, 0], [6, 9, 0], [6, 10, 1], [6, 11, 0], [6, 12, 2], [6, 13, 1], [6, 14, 3], [6, 15, 4], [6, 16, 0], [6, 17, 0], [6, 18, 0], [6, 19, 0], [6, 20, 1], [6, 21, 2], [6, 22, 2], [6, 23, 6]];
    let option = {
        polar: {},
        tooltip: {
            formatter: function (params) {
                return params.value[2] + ' commits in ' + hours[params.value[1]] + ' of ' + days[params.value[0]];
            }
        },
        angleAxis: {
            type: 'category',
            data: hours,
            boundaryGap: false,
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#999',
                    type: 'dashed'
                }
            },
            axisLine: {
                show: false
            }
        },
        radiusAxis: {
            type: 'category',
            data: days,
            axisLine: {
                show: false
            },
            axisLabel: {
                rotate: 45
            }
        },
        series: [{
            name: 'Punch Card',
            type: 'scatter',
            coordinateSystem: 'polar',
            symbolSize: function (val) {
                return val[2] * 2;
            },
            data: data,
            animationDelay: function (idx) {
                return idx * 5;
            }
        }]
    };

    charts4.setOption(option);
    charts4.hideLoading();
}
function renderCharts5(theme) {
    charts5 = echarts.init(document.getElementById('charts5'), theme);
    charts5.showLoading(loading);

    var xAxisData = [];
    var data1 = [];
    var data2 = [];
    for (var i = 0; i < 100; i++) {
        xAxisData.push('类目' + i);
        data1.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5);
        data2.push((Math.cos(i / 5) * (i / 5 - 10) + i / 6) * 5);
    }
    let option = {
        tooltip: {},
        xAxis: {
            data: xAxisData,
            silent: false,
            splitLine: {
                show: false
            }
        },
        yAxis: {
        },
        series: [{
            name: 'bar',
            type: 'bar',
            data: data1,
            animationDelay: function (idx) {
                return idx * 10;
            }
        }, {
            name: 'bar2',
            type: 'bar',
            data: data2,
            animationDelay: function (idx) {
                return idx * 10 + 100;
            }
        }],
        animationEasing: 'elasticOut',
        animationDelayUpdate: function (idx) {
            return idx * 5;
        }
    };

    charts5.setOption(option);
    charts5.hideLoading();
}
function renderCharts6(theme) {
    charts6 = echarts.init(document.getElementById('charts6'), theme);
    charts6.showLoading(loading);

    let option = {
        title: {
            
        },tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
        },
        series: [
            {
                name: '访问来源',
                type: 'pie',
                radius: '70%',
                center: ['50%', '50%'],
                data: [
                    { value: 335, name: '直接访问' },
                    { value: 310, name: '邮件营销' },
                    { value: 234, name: '联盟广告' },
                    { value: 135, name: '视频广告' },
                    { value: 1548, name: '搜索引擎' }
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };

    charts6.setOption(option);
    charts6.hideLoading();
}