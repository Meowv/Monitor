layui.define(['table', 'form'], function (exports) {
    var $ = layui.$
        , table = layui.table
        , form = layui.form;

    //user
    table.render({
        elem: '#LAY-user-manage'
        , url: '/api/account/get_users?role=0'
        , cols: [[
            { type: 'checkbox', fixed: 'left' }
            , { field: 'id', title: 'ID', sort: true }
            , { field: 'userName', title: '用户名', }
            , { field: 'nickName', title: '昵称', }
            , { field: 'roleName', title: '角色' }
            , { title: '操作', align: 'center', fixed: 'right', toolbar: '#table-useradmin-webuser' }
        ]]
        , page: true
        , limit: 10
        , height: '445'
    });
    table.on('tool(LAY-user-manage)', function (obj) {
        if (obj.event === 'del') {
            layer.confirm('确认删除此用户？', function (index) {
                var id = obj.data.id;
                $.ajax({
                    type: "post",
                    url: "/Account/DeleteUser?Id=" + id,
                    dataType: 'json',
                    data: null,
                    success: function (result) {
                        if (result.code == 0) {
                            layer.msg(result.msg, {
                                icon: 1,
                                time: 1000
                            }, function () {
                                obj.del();
                                layer.close(index);
                            });
                        } else {
                            layer.msg(result.msg, {
                                icon: 2,
                                time: 1000
                            });
                        }
                    }
                });
            });
        } else if (obj.event === 'edit') {
            layer.open({
                type: 2
                , title: '编辑用户'
                , content: '/account/edituser?id=' + $(obj.tr).find('td:eq(1)').text()
                , maxmin: true
                , area: ['500px', '450px']
            });
        }
    });

    //admin
    table.render({
        elem: '#LAY-user-back-manage'
        , url: '/api/account/get_users?role=1'
        , cols: [[
            { type: 'checkbox', fixed: 'left' }
            , { field: 'id', title: 'ID', sort: true }
            , { field: 'userName', title: '用户名', }
            , { field: 'nickName', title: '昵称', }
            , { field: 'roleName', title: '角色' }
            , { title: '操作', align: 'center', fixed: 'right', toolbar: '#table-useradmin-admin' }
        ]]
        , page: true
        , limit: 10
        , height: '445'
    });
    table.on('tool(LAY-user-back-manage)', function (obj) {
        if (obj.event === 'del') {
            layer.confirm('确定删除此管理员？', function (index) {
                var id = obj.data.id;
                $.ajax({
                    type: "post",
                    url: "/Account/DeleteUser?Id=" + id,
                    dataType: 'json',
                    data: null,
                    success: function (result) {
                        if (result.code == 0) {
                            layer.msg(result.msg, {
                                icon: 1,
                                time: 1000
                            }, function () {
                                obj.del();
                                layer.close(index);
                            });
                        } else {
                            layer.msg(result.msg, {
                                icon: 2,
                                time: 1000
                            });
                        }
                    }
                });
            });
        } else if (obj.event === 'edit') {
            layer.open({
                type: 2
                , title: '编辑管理员'
                , content: '/account/editadmin?id=' + $(obj.tr).find('td:eq(1)').text()
                , area: ['420px', '350px']
            })
        }
    });

    //role
    table.render({
        elem: '#LAY-user-back-role'
        , url: layui.setter.base + 'json/useradmin/role.js'
        , cols: [[
            { type: 'checkbox', fixed: 'left' }
            , { field: 'id', width: 80, title: 'ID', sort: true }
            , { field: 'rolename', title: '角色名' }
            , { field: 'limits', title: '拥有权限' }
            , { field: 'descr', title: '具体描述' }
            , { title: '操作', width: 150, align: 'center', fixed: 'right', toolbar: '#table-useradmin-admin' }
        ]]
        , text: '对不起，加载出现异常！'
    });

    //监听工具条
    table.on('tool(LAY-user-back-role)', function (obj) {
        var data = obj.data;
        if (obj.event === 'del') {
            layer.confirm('确定删除此角色？', function (index) {
                obj.del();
                layer.close(index);
            });
        } else if (obj.event === 'edit') {
            var tr = $(obj.tr);

            layer.open({
                type: 2
                , title: '编辑角色'
                , content: '../../../views/user/administrators/roleform.html'
                , area: ['500px', '480px']
                , btn: ['确定', '取消']
                , yes: function (index, layero) {
                    var iframeWindow = window['layui-layer-iframe' + index]
                        , submit = layero.find('iframe').contents().find("#LAY-user-role-submit");

                    //监听提交
                    iframeWindow.layui.form.on('submit(LAY-user-role-submit)', function (data) {
                        var field = data.field; //获取提交的字段

                        //提交 Ajax 成功后，静态更新表格中的数据
                        //$.ajax({});
                        table.reload('LAY-user-back-role'); //数据刷新
                        layer.close(index); //关闭弹层
                    });

                    submit.trigger('click');
                }
                , success: function (layero, index) {

                }
            })
        }
    });

    exports('useradmin', {})
});