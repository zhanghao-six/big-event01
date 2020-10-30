$(function() {
    // 1.自定义校验规则
    var form = layui.form;
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度为1 ~ 6之间!';
            }
        }
    });

    // 2. 获取用户信息
    initUserInfo();
    var layer = layui.layer;

    function initUserInfo() {
        //发送ajax
        $.ajax({
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 用户信息渲染到form表单中
                // console.log(res);
                form.val('formUserInfo', res.data);
            }
        })
    }


    // 3. 表单重置
    $('#btnReset').on('click', function(e) {
        // 3.1 阻止默认跳转
        e.preventDefault();
        // 3.2 从新用户渲染
        initUserInfo();
    });

    // 4. 修改用户信息
    $('.layui-form').on('submit', function(e) {
        // 阻止浏览器默认行为 form表单的提交
        e.preventDefault();
        // 发送ajax 修改用户信息
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                layer.msg('恭喜你,用户更新成功！');
                // 调用父页面中更新用户信息和头像的函数
                window.parent.getUserInfo();
            }
        })

    })



})