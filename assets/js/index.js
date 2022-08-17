$(function() {
    getUserInfo()
    var layer = layui.layer
    $('#btnLogout').on('click', function() {
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index){
            // 清除本地储存的token值
            localStorage.removeItem('token')
            // 跳转页面
            location.href='./login.html'
            // 关闭confirm窗口
            layer.close(index);
        });
    })
})

// 调用接口-获取用户信息
function getUserInfo() {
    $.ajax({
        method: 'get',
        url: '/my/userinfo',
        success: function(res) {
            if(res.status !== 0) {
                return layui.layer.msg("获取用户信息失败")
            }
            layui.layer.msg(res.message)
            renderAvatar(res.data)
        }
    })
}

// 渲染用户头像
function renderAvatar(user) {
    console.log(user)
    // 获取用户的名称
    var name = user.nickname || user.username
    // 设置欢迎文本
    $('#welcome').html('欢迎  '+ name)
    // 判断是否有头像，否的话显示文字头像
    if(user.user_pic !== null) {
        // attr设置被选元素的属性src和值
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    }else {
        // 把字符串转换成大写
        var firstN = name[0].toUpperCase()
        $('.text-avatar').html(firstN).show()
        $('.layui-nav-img').hide()
    }
}