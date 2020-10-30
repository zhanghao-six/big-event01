 $(function() {
     var layer = layui.layer;

     // 1. 文章列表显示
     initArtCateList();
     // 封装函数
     function initArtCateList() {
         $.ajax({
             url: '/my/article/cates',
             success: function(res) {
                 //  console.log(res);
                 var str = template('tpl-art-cate', res);
                 $('tbody').html(str);
             }
         })
     };


     // 2. 显示添加类别添加框
     $('#btnAdd').on('click', function() {
         indexAdd = layer.open({
             type: 1,
             area: ['500px', '260px'],
             title: '添加文章分类',
             content: $('#dialog-add').html()
         })
     });


     // 3. 提交文章分类添加(事件委托)
     var indexAdd = null;
     $('body').on('submit', '#form-add', function(e) {
         e.preventDefault();
         //  alert('11')
         $.ajax({
             method: 'POST',
             url: '/my/article/addcates',
             data: $(this).serialize(),
             success: function(res) {
                 //  console.log(res);
                 if (res.status !== 0) {
                     return layer.msg(res.message)
                 }
                 initArtCateList();
                 layer.msg('恭喜你,文章类别添加成功！');
                 layer.close(indexAdd)
             }
         })
     });


     // 4. 修改 - 展示表单
     var indexEdit = null;
     var form = layui.form;
     $('tbody').on('click', '.btn-edit', function() {
         // 利用框架代码 显示提示添加文章类别区域
         indexEdit = layer.open({
             type: 1,
             area: ['500px', '260px'],
             title: '修改文章分类',
             content: $('#dialog-edit').html()
         });
         // 显示完毕后 再获取Id对应的文章分类
         var Id = $(this).attr('data-id')
             //  alert(Id)
         $.ajax({
             url: '/my/article/cates/' + Id,
             success: function(res) {
                 //  console.log(res);
                 form.val('form-edit', res.data)
             }
         })

     });


     //  5. 修改 - 提交
     $('body').on('submit', '#form-edit', function(e) {
         e.preventDefault();
         $.ajax({
             method: 'POST',
             url: '/my/article/updatecate',
             data: $(this).serialize(),
             success: function(res) {
                 //  console.log(res);
                 if (res.status != 0) {
                     return layer.msg(res.message)
                 }
                 // 修改成功  重新渲染页面
                 initArtCateList();
                 layer.msg('恭喜你,修改成功！');
                 layer.close(indexEdit);
             }
         })
     })


     //  6. 删除 提交
     $('tbody').on('click', '.btn-delete', function() {
         //  获取删除的Id
         var Id = $(this).attr('data-id')
             //  alert(Id)
             // 询问框
         layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function(index) {
             //do something
             $.ajax({
                 url: '/my/article/deletecate/' + Id,
                 success: function(res) {
                     //  console.log(res);
                     if (res.status != 0) {
                         return layer.msg(res.message)
                     }
                     // 删除成功  重新渲染页面
                     initArtCateList();
                     layer.msg('恭喜你,删除成功！');
                     layer.close(index);
                 }
             })
         });
     });
 });