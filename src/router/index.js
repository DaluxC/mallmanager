import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login/login.vue'
import Home from '../components/home/home.vue'

Vue.use(VueRouter)

export default new VueRouter({
    routes:[
        {
            name:'Login',
            path:'/login',
            component:Login
        },
        {
            name:'Home',
            path:'/',
            component:Home
        }
    ]
})