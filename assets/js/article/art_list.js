$(function() {
    var form = layui.form
    var laypage = layui.laypage
    var layer = layui.layer

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 定义一个数据的查询对象
    // 需要将请求的参数对象，提交到服务器
    var q = {
        pagenum: 1, // 页码值，必填
        pagesize: 2, // 每页显示几条数据，必填
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的状态，可选值有：已发布、草稿
    }

    initTable()

    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
        method: 'GET',
        url: '/my/article/list',
        data: q,
        success: function(res) {
            console.log(res)
            if (res.status !== 0) {
            return layer.msg('获取文章列表失败！')
            }
            // 使用模板引擎渲染页面的数据
            var htmlStr = template('tpl-table', res)
            $('tbody').html(htmlStr)
            // 开始渲染分页部分
            renderPage(res.total)
        }
        })
    }

    initCate()

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                return layer.msg('获取分类数据失败！')
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 通过 layui 重新渲染表单区域的UI结构
                form.render()
            }
        })
    }

    // 绑定表单-筛选事件
    $('#form-search').on('submit',function(e) {
        e.preventDefault()
        // 获取表单的值
        var cate_id =$('[name=cate_id]').val()
        var state =$('[name=state]').val()
        // 更新q里面的值
        q.cate_id = cate_id
        q.state = state
        // 再次发起获取文章数据的请求
        initTable()
    })

    // 渲染分页的方法
    function renderPage(total) {
        console.log('进入渲染分页')
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页显示的数据大小
            curr: q.pagenum, //当前起始页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2,3,5,10],
            // 分页发生切换的时候，触发 jump 回调
            // 触发 jump 回调的方式有两种：
            // 1. 点击页码的时候，会触发 jump 回调
            // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
            jump: function(obj, first) {
                // 如果first=true 说明是方式二触发的
                // 否则，是方式一触发的
                console.log(first)
                console.log(obj.curr)
                // 把最新的页码值，赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr
                // 当用户触发显示条数的切换时，也会触发jump函数
                // 将最新的条数展示存放到q上面
                q.pagesize = obj.limit
                // 当用户触发页码时，重新调用文章列表接口
                if (!first) {
                    initTable()
                }
            }
          })
    }

    // 删除按钮-绑定事件
    $('tbody').on('click', '.btn-delete', function() {
        var len = $('.btn-delete').length
        // 获取到文章的 id
        var id = $(this).attr('data-id')
        console.log('id',id)

        // 询问用户是否要删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
          $.ajax({
            method: 'GET',
            url: '/my/article/delete/' + id,
            success: function(res) {
              if (res.status !== 0) {
                return layer.msg('删除文章失败！')
              }
              layer.msg('删除文章成功！')
            //   判断当然页面是否还有数据
              if(len === 1) {
                // len=q 说明点击之前，页面有1条数据，页码值最小为1
                q.pagenum = q.pagenum === 1 ? 1 :pagenum-1
              }
              initTable()
            }
          })
    
          layer.close(index)
        })
    })
})