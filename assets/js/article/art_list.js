 $(function() {
     // 1. 定义提交参数
     var q = {
         pagenum: 1, //    页码值
         pagesize: 2, //   每页显示多少条数据
         cate_id: '', //   文章分类的 Id
         state: '' //      文章的状态， 可选值有： 已发布、 草稿
     };



     // 2. 获取文章列表的方法
     initTable()

     function initTable() {
         $.ajax({
             url: '/my/article/list',
             data: q,
             success: function(res) {
                 //  console.log(res);
                 // 获取成功
                 var str = template('tpl-table', res);
                 $('tbody').html(str)
                     // 分页
                 renderPage(res.total)
             }
         })
     };


     // 3. 定义时间过滤器
     template.defaults.imports.dateFormat = function(dtStr) {
         var dt = new Date(dtStr)

         var y = dt.getFullYear();
         var m = padZero(dt.getMonth() + 1);
         var d = padZero(dt.getDate());

         var hh = padZero(dt.getHours());
         var mm = padZero(dt.getMinutes());
         var ss = padZero(dt.getSeconds());

         return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
     };

     // 4. 在个位数前面填充 0
     function padZero(n) {
         return n > 9 ? n : '0' + n;
     };


     // 5.渲染文章类别
     var form = layui.form;
     initCate();

     function initCate() {
         $.ajax({
             url: '/my/article/cates',
             success: function(res) {
                 if (res.status != 0) {
                     return layer.msg(res.message)
                 }
                 // 赋值 渲染form    
                 var htmlStr = template('tpl-cate', res);
                 $('[name =cate_id]').html(htmlStr)
                     //  
                 form.render();
             }
         })
     };



     // 6. 筛选功能
     $('#form-search').on('submit', function(e) {
         e.preventDefault();
         // 获取
         var state = $('[name=state]').val();
         var cate_id = $('[name=cate_id]').val();
         // 赋值
         q.state = state;
         q.cate_id = cate_id;
         // 初始化文章列表
         initTable();
     });


     // 7. 分页
     var laypage = layui.laypage;

     function renderPage(total) {
         //  alert(total)
         //  执行一个laypage的实例
         laypage.render({
             elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
             count: total, //数据总数，从服务端得到
             limit: q.pagesize, // 每页几条
             curr: q.pagenum, // 第几页
             // 分页功能  (按照layui)
             layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
             limits: [2, 3, 5, 10, 15],
             // 触发jump 分页初始化的时候 改变页面的时候
             jump: function(obj, first) {
                 //obj包含了当前分页的所有参数，比如：
                 //  console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                 //  console.log(obj.limit); //得到每页显示的条数
                 // 赋值页面
                 q.pagenum = obj.curr;
                 q.pagesize = obj.limit;
                 //首次不执行
                 if (!first) {
                     // 初始化文章列表
                     initTable();
                 }
             }
         });

     };


     // 8. 删除 (事件委托)
     var layer = layui.layer;
     $('tbody').on('click', '.btn-delete', function() {
         //  alert(11)
         var Id = $(this).attr('data-id');
         //  console.log(Id);
         // 询问框
         layer.confirm('确认删除吗?', { icon: 3, title: '提示' }, function(index) {
             //发送ajax
             $.ajax({
                 url: '/my/article/delete/' + Id,
                 success: function(res) {
                     if (res.status != 0) {
                         return layer.msg(res.message)
                     }
                     // 删除成功
                     layer.msg('文章删除成功！');
                     // 不是真正的删除  是覆盖
                     if ($(".btn-delete").length == 1 && q.pagenum > 1) q.pagenum--;
                     // 更新成功了 重新渲染
                     initTable();
                 }
             })
             layer.close(index);
         });
     })


 })