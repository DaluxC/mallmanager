<template>
    <el-container class="container">
        <el-header class="header">
            <el-row>
                <el-col :span="22" class="title"><h2>电商后台管理系统</h2></el-col>
                <el-col :span="2"><a href="#" @click.prevent="handleLogout()" class="logout">退出</a></el-col>
            </el-row>
        </el-header>
        <el-container>
            <el-aside class="aside" width="200px">
                <el-menu
                :router="true"
                :unique-opened="true"
                default-active="2"
                class="el-menu-vertical-demo">
                    <el-submenu v-for="item1 in menus" :key="item1.order" :index="item1.order.toString()">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>{{item1.authName}}</span>
                        </template>
                        <el-menu-item v-for="item2 in item1.children" :key="item2.order" :index="item2.path">
                            <i class="el-icon-menu"></i>
                            <span slot="title">{{item2.authName}}</span>
                        </el-menu-item>
                    </el-submenu>
                    
                </el-menu>
            </el-aside>
            <el-main class="main"><router-view></router-view></el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    name:'MallHome',
    data(){
        return {
            menus: []
        }
    },
    created(){
        this.getMenus()
    },
    methods:{
        //退出登录
        handleLogout(){
            //清token
            localStorage.clear()
            //弹一个elementui的成功提示
            this.$message.success("退出成功")
            //跳到登录页
            this.$router.push({name:"Login"})
        },
        //获取导航栏信息
        async getMenus(){
            const response = await this.$http.get('menus')
            console.log(response.data.meta.msg)
            if(response.data.meta.status === 200){
                this.menus = response.data.data
            }
        }
    }
}
</script>

<style>
.container {
    height: 100%;
}
.header {
    background-color: #b3c0d1;
}
.aside {
    background-color: #d3dce6;
}
.main {
    background-color: #e9eef3;
    height: 100%;
}
.title {
    text-align: center;
}
.logout {
    line-height: 60px;
    text-decoration: none;
}
</style>