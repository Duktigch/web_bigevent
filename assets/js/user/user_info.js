$(function() {
    var form = layui.form
    initUserInfo()
    form.verify({
        nickname: function(value, item) {
            if(value.length >6) {
                return '必须输入小于6个字符'
               
            }
            
        }
    })
})
// 点击个人基本资料-初始化用户信息
function initUserInfo() {
    var form = layui.form
    var layer = layui.layer
    $.ajax({
        method: 'get',
        url: '/my/userinfo',
        success: function(res) {
            if(res.status != 0) {
                return layer.msg("获取用户信息失败")
            }
            form.val("formUserInfo",res.data)
        }
    })
}
// 设置表单的重置绑定事件
$('#reset').on('click', function(e) {
    e.preventDefault()
    initUserInfo()
})

// 设置提交修改按钮绑定事件
$('.layui-form').on('submit', function(e){
    e.preventDefault()
    // 获取表单的所有数据
    var data = $(this).serialize()
    console.log('data',data)
    $.ajax({
        method: 'post',
        url: '/my/userinfo',
        data: data,
        success: function(res) {
            if(res.status != 0) {
                return layer.msg("更新用户信息失败")
            }
            layer.msg("更新用户信息成功")
            // 当前页面只是出于iframe的窗口
            // 调用父页面中的方法，重新渲染用户的头像和用户的信息
            window.parent.getUserInfo()
        }
    })
})