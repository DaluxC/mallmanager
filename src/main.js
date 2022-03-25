import Vue from 'vue'
import ElementUI from 'element-ui'
import moment from 'moment'

import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/reset.css'

import myBreadcrumb from './components/cuscom/Breadcrumb.vue'
import router from './router/index'
import MyHttpServer from './plugins/http'
import App from './App.vue'

Vue.use(ElementUI);
Vue.use(MyHttpServer)
Vue.component('my-breadcrumb', myBreadcrumb)

Vue.config.productionTip = false

//创建全局过滤器，用于格式化时间
Vue.filter('fmtdate', v => {
  return moment(v).format('YYYY-MM-DD')
})

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
