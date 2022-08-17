// 注意：每次调用get(),post(),ajax()
// 都会先调用ajaxPreFilter这个函数
// 在这个函数中，我们可以拿到给ajax配置对象
$.ajaxPrefilter(function(options) {
    // 将请求的url统一管理根路径，方便修改
    options.url = 'http://www.liulongbin.top:3007' + options.url
    // 统一为有权限的接口设置headers请求头
    // 如果要检索的字符串值没有出现，则该方法返回 -1
    if(options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
     // 全局统一挂载 complete 回调函数
    options.complete = function(res) {
        // console.log('执行了 complete 回调：')
        // console.log(res)
        if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 清除本地储存的token值
            localStorage.removeItem('token')
            // 跳转页面
            location.href='./login.html'
        }
    }

})