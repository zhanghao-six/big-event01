// 入口函数
$(function() {
    // 1.点击去注册账号,隐藏登录区域，显示注册区域。
    $('#link_reg').on('click', function() {
        $('.login-box').hide()
        $('.reg-box').show()
    });
    // 点击去登录账号,隐藏注册区域，显示登录区域。
    $('#link_login').on('click', function() {
        $('.login-box').show()
        $('.reg-box').hide()
    });

    // 2.自定义校验规则
    var form = layui.form;
    // from 就是导入layui.all文件里的
    form.verify({
        // 2.1密码校验
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 2.2注册确认密码校验
        repwd: function(value) {
            // 选择器必须带宫格，选择的是后代中的input,name属性值为password那个标签
            var pwd = $('.reg-box input[name=password]').val()
                // 比较密码是否一样
            if (value !== pwd) {
                return '对不起,两次密码输入不一致!'
            }
        }
    });

    // 弹出层  导入layui里面的弹出层
    var layer = layui.layer;
    // 3.注册功能
    $('#form_reg').on('submit', function(e) {
        // 3.1 阻止默认提交
        e.preventDefault();
        // 3.2 发送ajax
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: {
                username: $('.reg-box [name=username]').val(),
                password: $('.reg-box [name=password]').val(),
            },
            success: function(res) {
                // 3.3 判断状态
                if (res.status != 0) {
                    // console.log(res.message);
                    layer.msg(res.message);
                }
                // console.log(res.message);
                layer.msg('注册成功, 请登录! ');
                // 自动切换到登录页面
                $('#link_login').click();
                // 重置注册表单
                $('#form_reg')[0].reset();
            }

        })
    });

    // 4.登录功能
    $('#form_login').submit(function(e) {
        // 4.1 阻止默认跳转
        e.preventDefault();
        // 4.2 发送ajax
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(), // serialize() 快速获取表单内容
            success: function(res) {
                // 判断是否登录成功
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                layer.msg('恭喜你,登录成功！');
                // 保存token值  可以访问有密钥的页面
                localStorage.setItem('token', res.token);
                // 跳转到主页
                location.href = '/index.html';
            }
        })
    })
})