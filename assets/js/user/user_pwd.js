$(function() {
    // 定义表单校验规则
    var form = layui.form
    form.verify({
        // 验证原密码是否和登录的密码相同 ---代优化
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        newPwd: function(value) {
            if(value === $('[name=oldPwd]').val()) {
                return '两次密码不可以相同'
            }
        },
        rePwd: function(value) {
            if(value !== $('[name=newPwd]').val()) {
                return '密码必须相同'
            }
        }
    })
    $('.layui-form').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
          method: 'POST',
          url: '/my/updatepwd',
          data: $(this).serialize(),
          success: function(res) {
            if (res.status !== 0) {
              return layui.layer.msg('更新密码失败！')
            }
            layui.layer.msg('更新密码成功！')
            // 重置表单
            // 利用jquery拿到jquery对象-然后获得原生dom对象，使用原生reset方法
            $('.layui-form')[0].reset()
          }
        })
    })
    
})
