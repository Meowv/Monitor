/**
 @Name：layuiAdmin（iframe版） 设置
 @Author：贤心
 @Site：http://www.layui.com/admin/
 @License: LPPL
 */
layui.define(['form', 'upload'], function (exports) {
    var $ = layui.$
        , layer = layui.layer
        , admin = layui.admin
        , form = layui.form;

    //自定义验证
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


    //设置密码
    form.on('submit(setmyinfo)', function (obj) {
        layer.msg(JSON.stringify(obj.field));

        //提交修改
        /*
        admin.req({
          url: ''
          ,data: obj.field
          ,success: function(){
            
          }
        });
        */
        return false;
    });

    //Password
    form.on('submit(setmypass)', function (obj) {
        layer.msg(JSON.stringify(obj.field));

        //提交修改
        /*
        admin.req({
          url: ''
          ,data: obj.field
          ,success: function(){
            
          }
        });
        */
        return false;
    });

    //对外暴露的接口
    exports('set', {});
});