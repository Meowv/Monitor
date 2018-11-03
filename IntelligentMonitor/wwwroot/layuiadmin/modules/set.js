layui.define(['form', 'upload'], function (exports) {
    var $ = layui.$
        , layer = layui.layer
        , form = layui.form;

    const nickname = $('input[name="NickName"]').val();

    //verify
    form.verify({
        nickname: function (value, item) {
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                return '用户名不能有特殊字符';
            }
            if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                return '用户名首尾不能出现下划线\'_\'';
            }
            if (/^\d+\d+\d$/.test(value)) {
                return '用户名不能全为数字';
            }
        }
        , pass: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ]
        , repass: function (value) {
            if (value !== $('#LAY_password').val()) {
                return '两次密码输入不一致';
            }
        }
    });

    //Profile
    form.on('submit(setmyinfo)', function (obj) {
        if (obj.field.NickName == nickname) {
            return false;
        }
        $.ajax({
            type: "post",
            dataType: 'json',
            url: '/Account/Profile',
            data: obj.field,
            success: function (result) {
                if (result.code == 0) {
                    layer.msg(result.msg, {
                        icon: 1,
                        time: 1000
                    }, function () {
                        location.reload();
                    });
                } else {
                    layer.msg(result.msg, {
                        icon: 2,
                        time: 1000
                    });
                }
            }
        });
        return false;
    });

    //Password
    form.on('submit(setmypass)', function (obj) {
        $.ajax({
            type: "post",
            dataType: 'json',
            url: '/Account/Password',
            data: obj.field,
            success: function (result) {
                if (result.code == 0) {
                    layer.msg(result.msg, {
                        icon: 1,
                        time: 1000
                    }, function () {
                        location.reload();
                    });
                } else {
                    layer.msg(result.msg, {
                        icon: 2,
                        time: 1000
                    });
                }
            }
        });
        return false;
    });

    exports('set', {});
});