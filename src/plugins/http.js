//将axios封装为一个插件

import Axios from 'axios'

const MyHttpServer = {}

MyHttpServer.install = (Vue) => {
    Axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
    Vue.prototype.$http = Axios
}

export default MyHttpServer