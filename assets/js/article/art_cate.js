$(function() {
    var layer = layui.layer
    var form = layui.form
    initArtCateList()

    function initArtCateList() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                // 将res这个大对象给tpl-table模板
                var htmlStr = template('tpl-table',res)
                $('#table-body').html(htmlStr)
            }
        })
    }

    // 为添加类别-绑定触发事件
    var indexAdd = null
    $('#btnAddCate').on('click', function() {
        
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '添加文章分类'
            ,content: $('#dialog-add').html()
          });               
    })

    // 动态创建的表单是不可以直接获取的，必须通过代理的方式
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault()
        console.log($(this).serialize())
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                console.log(res)
                if (res.status !== 0) {
                return layer.msg('新增分类失败！')
                }
                initArtCateList()
                layer.msg('新增分类成功！')
                // 根据索引，关闭对应的弹出层
                layer.close(indexAdd)
            }
        })
    })

    // 为添加编辑按钮-绑定触发事件
    var indexEdit = null
    $('tbody').on('click', '#btn-edit', function() {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '编辑',
            content: $('#dialog-edit').html()
          }); 
          
        //   this指向编辑按钮，获取其数据
          var id = $(this).attr('data-id')
          $.ajax({
            method: 'get',
            url: '/my/article/cates/' + id,
            success: function(res) {
                form.val('editForm', res.data)
            }
        })
    })

    // 给确认修改按钮-绑定事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
        $.ajax({
              method: 'POST',
              url: '/my/article/updatecate',
              data: $(this).serialize(),
              success: function(res) {
                if (res.status !== 0) {
                  return layer.msg('更新分类数据失败！')
                }
                layer.msg('更新分类数据成功！')
                layer.close(indexEdit)
                initArtCateList()
              }
        })
    })

    // 给删除按钮，绑定事件
    $('tbody').on('click', '#btn-delete',function() {
        //  this指向删除按钮，获取其数据
        var id = $(this).attr('data-id')
        layer.confirm('确定要删除该数据?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if(res.status !== 0) {
                        return layer.msg('删除失败')
                    }
                    layer.msg('删除分类成功！')
                    layer.close(index)
                    initArtCateList()
                }
            })
        });
        
    })
}) 

