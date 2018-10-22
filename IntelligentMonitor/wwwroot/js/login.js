particlesJS('particles-js', {
    "particles": {
        "number": {
            "value": 40,
            "density": {
                "enable": true,
                "value_area": 800
            }
        },
        "color": {
            "value": "#ffffff"
        },
        "shape": {
            "type": "circle",
            "stroke": {
                "width": 0,
                "color": "#000000"
            },
            "polygon": {
                "nb_sides": 5
            },
            "image": {
                "src": "img/github.svg",
                "width": 100,
                "height": 100
            }
        },
        "opacity": {
            "value": 0.7,
            "random": false,
            "anim": {
                "enable": false,
                "speed": 1,
                "opacity_min": 0.1,
                "sync": false
            }
        },
        "size": {
            "value": 3,
            "random": true,
            "anim": {
                "enable": false,
                "speed": 40,
                "size_min": 0.1,
                "sync": false
            }
        },
        "line_linked": {
            "enable": true,
            "distance": 150,
            "color": "#ffffff",
            "opacity": 0.6,
            "width": 1
        },
        "move": {
            "enable": true,
            "speed": 6,
            "direction": "none",
            "random": false,
            "straight": false,
            "out_mode": "out",
            "bounce": false,
            "attract": {
                "enable": false,
                "rotateX": 600,
                "rotateY": 1200
            }
        }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onhover": {
                "enable": true,
                "mode": "grab"
            },
            "onclick": {
                "enable": true,
                "mode": "push"
            },
            "resize": true
        },
        "modes": {
            "grab": {
                "distance": 200,
                "line_linked": {
                    "opacity": 1
                }
            },
            "bubble": {
                "distance": 400,
                "size": 40,
                "duration": 2,
                "opacity": 8,
                "speed": 3
            },
            "repulse": {
                "distance": 200,
                "duration": 0.4
            },
            "push": {
                "particles_nb": 4
            },
            "remove": {
                "particles_nb": 2
            }
        }
    },
    "retina_detect": false
});

document.querySelector(".login-button").onclick = function () {
    let username = $('input[name="username"]').val().trim();
    let password = $('input[name="password"]').val().trim();
    if (username.length > 0 && password.length > 0) {
        addClass(document.querySelector(".login"), "active");
        setTimeout(function () {
            addClass(document.querySelector(".sk-rotating-plane"), "active");
            document.querySelector(".login").style.display = "none";
        }, 800);
        setTimeout(function () {
            removeClass(document.querySelector(".login"), "active");
            removeClass(document.querySelector(".sk-rotating-plane"), "active");
            document.querySelector(".login").style.display = "block";
            $.ajax({
                type: "post",
                dataType: 'json',
                url: 'Login',
                data: $('#login').serialize(),
                success: function (data) {
                    if (data.code == 0) {
                        layer.msg(data.result, {
                            icon: 1,
                            time: 1000
                        }, function () {
                            location.href = "/";
                        });                    } else {
                        layer.msg(data.result, {
                            icon: 2,
                            time: 1000
                        });
                    }
                }
            });
        }, 1500);
    } else {
        if (username.length > 0) {
            layer.msg("请输入您的密码");
        }
        if (password.length > 0) {
            layer.msg("请输入您的用户名");
        }
        return false;
    }
}

document.oncontextmenu = new Function("event.returnValue=false;");
document.onselectstart = new Function("event.returnValue=false;");

function hasClass(elem, cls) {
    cls = cls || '';
    if (cls.replace(/\s/g, '').length == 0) return false;
    return new RegExp(' ' + cls + ' ').test(' ' + elem.className + ' ');
}

function addClass(ele, cls) {
    if (!hasClass(ele, cls)) {
        ele.className = ele.className == '' ? cls : ele.className + ' ' + cls;
    }
}

function removeClass(ele, cls) {
    if (hasClass(ele, cls)) {
        var newClass = ' ' + ele.className.replace(/[\t\r\n]/g, '') + ' ';
        while (newClass.indexOf(' ' + cls + ' ') >= 0) {
            newClass = newClass.replace(' ' + cls + ' ', ' ');
        }
        ele.className = newClass.replace(/^\s+|\s+$/g, '');
    }
}