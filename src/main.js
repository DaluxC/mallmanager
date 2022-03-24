import Vue from 'vue'
import ElementUI from 'element-ui'

import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/reset.css'

import router from './router/index'
import MyHttpServer from './plugins/http'
import App from './App.vue'

Vue.use(ElementUI);
Vue.use(MyHttpServer)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
