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
                    <el-submenu index="1">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>用户管理</span>
                        </template>
                        <el-menu-item index="user">
                            <i class="el-icon-menu"></i>
                            <span slot="title">用户列表</span>
                        </el-menu-item>
                    </el-submenu>
                    <el-submenu index="2">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>权限管理</span>
                        </template>
                        <el-menu-item index="role">
                            <i class="el-icon-menu"></i>
                            <span slot="title">角色列表</span>
                        </el-menu-item>
                        <el-menu-item index="right">
                            <i class="el-icon-menu"></i>
                            <span slot="title">权限列表</span>
                        </el-menu-item>
                    </el-submenu>
                    <el-submenu index="3">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>商品管理</span>
                        </template>
                            <el-menu-item index="3-1">
                                <i class="el-icon-menu"></i>
                                <span slot="title">商品列表</span>
                            </el-menu-item>
                            <el-menu-item index="3-2">
                                <i class="el-icon-menu"></i>
                                <span slot="title">分类参数</span>
                            </el-menu-item>
                            <el-menu-item index="3-3">
                                <i class="el-icon-menu"></i>
                                <span slot="title">商品分类</span>
                            </el-menu-item>
                    </el-submenu>
                    <el-submenu index="4">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>订单管理</span>
                        </template>
                            <el-menu-item index="4-1">
                                <i class="el-icon-menu"></i>
                                <span slot="title">订单列表</span>
                            </el-menu-item>
                    </el-submenu>
                    <el-submenu index="5">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>数据统计</span>
                        </template>
                            <el-menu-item index="5-1">
                                <i class="el-icon-menu"></i>
                                <span slot="title">数据报表</span>
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
    //home页渲染前判断是否登录
    beforeCreate(){
        //获取token
        const token = localStorage.getItem("token")
        //如果没token那么说明没登录
        if(!token){
            //跳到登陆界面
            this.$router.push({name:"Login"})
        }
        //否则继续下一个钩子
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