//1. 开发环境服务器地址
var baseURL = 'http://ajax.frontend.itheima.net';
//2. 测试环境服务器地址
// var baseURL = 'http://ajax.frontend.itheima.net';
//3. 生产环境服务器地址
// var baseURL = 'http://ajax.frontend.itheima.net';



//拦截所有ajax请求 :  get/post/ajax;
//处理函数
$.ajaxPrefilter(function(params) {
    // console.log(params);
    // 拼接对应环境的服务器地址
    params.url = baseURL + params.url;


    //对需要权限的接口配置头信息
    //必须以/my/开头才行
    if (params.url.indexOf('/my/') !== -1) {
        params.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
});