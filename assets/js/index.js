// 入口函数
$(function() {
    // 1. 用于获取用户信息
    getUserInfo();
    // 4. 退出功能
    $('#btnLogout').on('click', function() {
        // alert(11)
        // layui 询问框
        layer.confirm('确认退出登录吗?', { icon: 3, title: '提示' }, function(index) {
            // 4.1 删除token值
            localStorage.removeItem('token');
            // 4.2 跳转到登录页面上
            location.href = '/login.html';
            // 关闭询问框
            layer.close(index);
        });
    })
});

// 2.获取用户信息(封装必须在入口函数外面 全局)
function getUserInfo() {
    // 2.1 发送ajax
    $.ajax({
        url: '/my/userinfo',
        // 接口文档中 以/my地址都要加上请求头
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            // console.log(res);
            // 判断状态码
            if (res.status !== 0) {
                return layui.layer.msg(res.message);
            }
            // 请求成功,渲染用户头像信息
            renderAvatar(res.data);
        },
        // 不论成功还是失败  最终都会调用 complete 回调函数
        // complete: function(res) {
        //     // console.log('执行了 complete 回调');
        //     // console.log(res);
        //     // 在complete回调函数中 可以使用res.resposeJSON 拿到服务器响应回来的数据
        //     if (res.responseJSON.status === 1 && res.resposeJSON.message === '身份认证失败!') {
        //         // 强制清空token
        //         localStorage.removeItem('token')
        //             // 强制跳转到登录页面
        //         location.href = '/login.html'
        //     }
        // }
    })
}

// 3.封装用户头像渲染函数
function renderAvatar(user) {
    // 3.1 用户名
    var name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    // 3.2 用户头像
    if (user.user_pic !== null) {
        // 有头像 隐藏文字头像
        $('.layui-nav-img').show.attr('src', user.user_pic);
        $('.user-avatar').hide();
    } else {
        // 没有头像 显示文字头像
        $('.layui-nav-img').hide();
        // 第一个文字大写
        var text = name[0].toUpperCase();
        $('.user-avatar').show().html(text);
    }

}