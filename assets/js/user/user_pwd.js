// 入口函数
$(function() {
    // 1.定义校验规则
    var form = layui.form;
    form.verify({
        // 1.1 密码
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 1.2 新旧密码
        samepwd: function(value) {
            // value是新密码 旧密码需要获取
            if (value === $('[name=oldPwd]').val()) {
                return '原密码和旧密码不能相同！';
            }
        },
        // 1.3 两次新密码必须相同
        repwd: function(value) {
            // value是再次输入的密码  新密码需要重新获取
            if (value !== $('[name=newPwd]').val()) {
                return '两次新密码不一致！'
            }
        },
    });

    // 2. 修改密码
    $('.layui-form').on('submit', function(e) {
        // 2.1 阻止默认提交
        e.preventDefault();
        // 2.2 发送ajax
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message);
                }
                layui.layer.msg('密码修改成功,请重新登陆!');
                setTimeout(() => {
                    window.parent.location.href = '/login.html';
                }, 3000);
                $('.layui-form')[0].reset();

            }
        })
    })
})