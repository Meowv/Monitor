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
        , url: '/api/account/get_roles'
        , cols: [[
            { type: 'checkbox', fixed: 'left' }
            , { field: 'id', width: 80, title: 'ID', sort: true }
            , { field: 'roleName', title: '角色名' }
            , { field: 'permissionList', title: '拥有权限', templet: '#permission' }
            , { title: '操作', width: 150, align: 'center', fixed: 'right', toolbar: '#table-useradmin-admin' }
        ]]
    });
    table.on('tool(LAY-user-back-role)', function (obj) {
        if (obj.event === 'del') {
            layer.confirm('确定删除此角色？', function (index) {
                var id = obj.data.id;
                $.ajax({
                    type: "post",
                    url: "/Account/DeleteRole?Id=" + id,
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
                , title: '编辑角色'
                , content: '/Account/EditRole?Id=' + $(obj.tr).find('td:eq(1)').text()
                , area: ['400px', '300px']
            })
        }
    });

    exports('useradmin', {})
});