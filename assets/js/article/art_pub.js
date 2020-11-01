 $(function() {
     var form = layui.form;
     var layer = layui.layer;
     initCate();
     // 1. 初始化分类
     function initCate() {
         $.ajax({
             url: '/my/article/cates',
             success: function(res) {
                 if (res.status != 0) {
                     return layer.msg(res.message)
                 }
                 // 赋值 渲染form    
                 var htmlStr = template('tpl-cate', res);
                 $('[name =cate_id]').html(htmlStr);
                 //  重新加载 表单
                 form.render();
             }
         })
     };

     // 2.初始化富文本编辑器
     initEditor()

     // 3. 裁剪区
     // 3.1 初始化图片裁剪器
     var $image = $('#image')

     // 3.2 裁剪选项
     var options = {
         aspectRatio: 400 / 280,
         preview: '.img-preview'
     }

     // 3.3 初始化裁剪区域
     $image.cropper(options)


     // 4. 点击按钮 选择图片
     $('#btnChooseImage').on('click', function() {
         $('#coverFile').click();
     })

     // 5. 监听选择封面
     $('#coverFile').on('change', function(e) {
         //  拿到用户选择的文件
         var file = e.target.files[0];
         //  判断
         if (file == undefined) {
             return;
         }
         // 根据选择的文件，创建一个对应的 URL 地址：
         var newImgURL = URL.createObjectURL(file)
             //先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：
         $image
             .cropper('destroy') // 销毁旧的裁剪区域
             .attr('src', newImgURL) // 重新设置图片路径
             .cropper(options) // 重新初始化裁剪区域
     });

     // 6. 设置状态
     var state = '已发布';
     $('#btnSave1').on('click', function() {
         //  state = '已发布';
         //  alert(111)
     })
     $('#btnSave2').on('click', function() {
         state = '草稿';
         //  alert(111)
     });


     // 7. 添加文章
     $('#form-pub').on('submit', function(e) {
         e.preventDefault();
         // 创建FormData对象   收集数据
         var fd = new FormData(this);
         // 放入状态
         fd.append('state', state);
         // 放入图片   生成图片是异步操作
         $image
             .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                 width: 400,
                 height: 280
             })
             .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                 // 得到文件对象后，进行后续的操作
                 fd.append('cover_img', blob)
                     //  console.log(...fd);
                     // 发送ajax
                 publishArticle(fd)
             })
     });

     //  封装  添加文章的方法
     function publishArticle(fd) {
         //  console.log(...fd);
         $.ajax({
             method: 'POST',
             url: '/my/article/add',
             data: fd,
             // 上传图片必须有两个属性
             contentType: false,
             processData: false,
             success: function(res) {
                 if (res.status != 0) {
                     return layer.msg(res.message)
                 }
                 // 发布成功 跳转
                 //  location.href = '/article/art_list.html'
                 layer.msg(res.message)
                 setTimeout(function() {
                     window.parent.document.getElementById('art_list').click();
                 }, 1500)
             }

         })
     }

 })