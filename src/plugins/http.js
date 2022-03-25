//将axios封装为一个插件

import Axios from 'axios'

const MyHttpServer = {}

MyHttpServer.install = (Vue) => {
    Axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
    Vue.prototype.$http = Axios

    //设置请求拦截器：当请求不是登录请求(/login)时提交token
    Axios.interceptors.request.use(function(config) {
        console.log(`本次请求为${config.url}`)
        //当设置baseURL时，使用config.url时将自动剔除完整请求url中的baseURL的部分
        if(config.url !== 'login'){
            console.log('本次请求将提交token')
            const token = localStorage.getItem('token')
            //提交token进行认证
            config.headers['Authorization'] = token
        }
        return config
    }, function(error) {
        console.log(error)
    })
}

export default MyHttpServer