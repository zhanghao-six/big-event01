// 入口函数
$(function() {
    // 1. 用于获取用户信息
    getUserInfo();
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

        }

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