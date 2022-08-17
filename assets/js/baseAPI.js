// 注意：每次调用get(),post(),ajax()
// 都会先调用ajaxPreFilter这个函数
// 在这个函数中，我们可以拿到给ajax配置对象
$.ajaxPrefilter(function(options) {
    // 将请求的url统一管理根路径，方便修改
    options.url = 'http://www.liulongbin.top:3007' + options.url
})