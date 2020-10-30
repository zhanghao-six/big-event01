$(function() {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
        // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)


    // 1.4 选择文件
    $('#btnChoseImage').on('click', function() {
        $('#file').click();
    })

    // 1.5 拿到用户裁剪图片
    var layer = layui.layer;
    $('#file').on('change', function(e) {
        // 1.6   拿到用户选择的文件
        var file = e.target.files[0];
        // 非空校验
        // console.log(file);
        if (file == undefined) {
            return layer.msg('请选择图片！')
        }
        // 1.7 根据选择的文件  创建一个对于的url地址
        var newImgURL = URL.createObjectURL(file)
            // 1.8 先销毁旧裁剪区域  再重新设置图路径 之后再创建
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });

    // 1.7 上传头像
    $('#btnUpload').on('click', function() {
        // 将裁剪后的图片，输出为 base64 格式的字符串
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
            // console.log(dataURL);
            // console.log(typeof dataURL);

        // 发送ajax
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('更新头像成功!');
                // 重新更换头像
                window.parent.getUserInfo();

            }
        })
    })

})