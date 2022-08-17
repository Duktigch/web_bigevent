$(function() {
    // 点击去注册的链接
    $('#link-reg').on('click', function() {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    // 点击去登录的链接
    $('#link-login').on('click', function() {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 从layui当中获取form对象
    var form = layui.form
    // 从layui当中获取获取layer对象-弹出框
    var layer = layui.layer;
    // form.vertical函数自定义校验规则
    form.verify({
        password: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
          ],
        //   直接通过repassword获取value形参
          repassword: function(value) {
            // 拿到确认密码的值
            // 拿到密码的值
            // 判断两个值是否一致，不一致就提示
            var pwd = $('#form-reg [name="password"]').val()
            if(value !== pwd) {
                return '两次密码不一致'
            }
        }
    })
    // 注册表单绑定事件
    $('#form-reg').on('submit', function(e) {
        e.preventDefault()
        var data = {username: $('#form-reg [name="username"]').val(),password:$('#form-reg [name="password"]').val()}
        $.post('/api/reguser',
        data,
        function(res) {
            if(res.status !== 0) {
                return layer.msg(res.message)
            }
            layer.msg('注册成功，请登录')
            // 模拟人的点击行为
            $('#link-login').click()
        })
    })
    // 登录表单绑定事件
    $('#form_login').submit(function(e) {
        // 阻止表单的默认事件-跳转
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/api/login',
            data: $(this).serialize(),
            success: function(res) {
                if(res.status != 0) {
                    return layer.msg('登录失败，请重新登录')
                }
                layer.msg('登录成功')
                // 将登录成功的token保存到localstrage中
                localStorage.setItem('token', res.token)
                // 跳转到后台页面
                location.href = '/index.html'

            }
        })
    })
})

