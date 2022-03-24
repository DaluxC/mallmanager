<template>
    <div class="login-wrap">
        <el-form class="login-form" :label-position="labelPosition" label-width="80px" :model="formdata">
            <h2>用户登录</h2>
            <el-form-item label="用户名">
                <el-input v-model="formdata.username"></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="formdata.password"></el-input>
            </el-form-item>
            <el-button @click.prevent="handleLogin()" class="login-btn" type="primary">登录</el-button>
        </el-form>
    </div>
</template>

<script>
export default {
    name:'UserLogin',
    data() {
      return {
        labelPosition: 'top',
        formdata: {
          name: '',
          password: ''
        }
      };
    },
    methods:{
        //登录
        async handleLogin(){
            const response = await this.$http.post('login', this.formdata)
            console.log(response)
            //获取响应信息(response)中的data对象和meta对象
            //meta对象的msg为提示信息，"登录成功"、"用户名不存在"、"密码错误"
            //meta对象的status用于判断登陆是否成功，200为成功，否则登陆失败
            const {data, meta:{msg, status}} = response.data
            //登陆成功
            if(status === 200){
                //存token
                localStorage.setItem('token', data.token)
                //跳转到home页
                this.$router.push({name:'Home'})
                //弹一个elementui的成功提示
                this.$message.success(msg);
            }else{
                //登陆失败：弹一个elementui的错误提示
                this.$message.error(msg);
            }
            
        }
    }
}
</script>

<style>
    .login-wrap {
        height: 100%;
        background-color: #324152;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .login-form {
        width: 400px;
        padding: 30px;
        background-color: white;
        border-radius: 5px;
    }
    .login-btn {
        width: 100%;
    }
</style>