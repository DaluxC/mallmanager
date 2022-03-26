import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login/login.vue'
import Home from '../components/home/home.vue'
import User from '../components/user/user.vue'
import Right from '../components/rights/right.vue'
import Role from '../components/rights/role.vue'

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
            component:Home,
            //Home的路由子组件
            children:[
                {
                    name:'User',
                    path:'/user',
                    component:User
                },
                {
                    name:'Right',
                    path:'/right',
                    component:Right
                },
                {
                    name:'Role',
                    path:'/role',
                    component:Role
                }
            ]
        }
    ]
})