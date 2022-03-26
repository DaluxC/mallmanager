import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login/login.vue'
import Home from '../components/home/home.vue'
import User from '../components/user/user.vue'
import Right from '../components/rights/right.vue'
import Role from '../components/rights/role.vue'

Vue.use(VueRouter)

const router = new VueRouter({
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
                    path:'/users',
                    component:User
                },
                {
                    name:'Right',
                    path:'/rights',
                    component:Right
                },
                {
                    name:'Role',
                    path:'/roles',
                    component:Role
                }
            ]
        }
    ]

})

//设置全局路由守卫：如果不是登录请求，在home页渲染前检查token
router.beforeEach((to, from, next) => {
    if(to.path !== '/login'){
        const token = localStorage.getItem("token")
        //如果没token那么说明没登录
        if(!token){
            //跳到登陆界面
            router.push({name:"Login"})
        }else{
            next()
        }
    }else{
        next()
    }
})

export default router