<template>
    <el-card class="box-card">
        <!-- 面包屑 -->
        <my-breadcrumb level1='用户管理' level2='用户列表'></my-breadcrumb>

        <!-- 输入框 -->
        <el-row class="search-row">
            <el-col>
                <el-input placeholder="请输入内容" v-model="query" @clear="loadUserList" class="input-search" clearable>
                    <el-button @click="searchUser()" slot="append" icon="el-icon-search"></el-button>
                </el-input>
                <el-button class="search-btn" type="success"  @click="addUserDialog()" plain>添加用户</el-button>
                
            </el-col>
        </el-row>

        <!-- 用户列表 -->
        <el-table
        :data="userList"
        style="width: 100%">
            <el-table-column
                type="index"
                label="#"
                width="60">
            </el-table-column>
            <el-table-column
                prop="username"
                label="姓名"
                width="80">
            </el-table-column>
            <el-table-column
                prop="email"
                label="邮箱">
            </el-table-column>
            <el-table-column
                prop="mobile"
                label="电话">
            </el-table-column>
            <el-table-column
                label="创建日期"
                width="100">
                <!-- 使用过滤器要用到插值语法，那就在el-table-column标签体中直接插数据，而不使用prop属性 -->
                <!-- 这个el-table-column是elementui中的一个组件，而向组件标签的标签体中添加结构需要用到插槽 -->
                <!-- 而要添加的结构中有数据，并且数据来源于user组件，就需要使用作用域插槽(slot-scope)将数据传给要添加的结构 -->
                <!-- scope.row意为userList中的每一个对象(因为:data="userList")，那么scope.row.create_time就是userList中的每一个对象的create_time属性 -->
                <template slot-scope="scope">
                    {{scope.row.create_time | fmtdate}}
                </template>
            </el-table-column>
            <el-table-column
                label="用户状态"
                width="100">
                <template slot-scope="scope">
                    <el-switch
                        v-model="scope.row.mg_state"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        @change="changeMgState(scope.row)">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column
                label="操作">
                <template slot-scope="scope">
                    <el-row>
                        <el-button type="primary" icon="el-icon-edit" @click="editUserDialog(scope.row)" circle plain></el-button>
                        <el-button type="danger" icon="el-icon-delete" @click="deleteUserAlert(scope.row.id)" circle plain></el-button>
                        <el-button type="success" icon="el-icon-check" @click="setRoleDialog(scope.row)" circle plain></el-button>
                    </el-row>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenumber"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="4"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
        </el-pagination>

        <!-- 添加用户的弹窗 -->
        <el-dialog title="添加用户" :visible.sync="dialogTableVisibleAdd">
            <el-form :data="form">
                <el-form-item label="用户名" label-width="90px">
                    <el-input v-model="form.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" label-width="90px">
                    <el-input v-model="form.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" label-width="90px">
                    <el-input v-model="form.email" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话" label-width="90px">
                    <el-input v-model="form.mobile" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogTableVisibleAdd = false">取 消</el-button>
                <el-button type="primary" @click="addUser()">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 编辑用户的弹窗 -->
        <el-dialog title="编辑用户" :visible.sync="dialogTableVisibleEdit">
            <el-form :data="form">
                <el-form-item label="用户名" label-width="90px">
                    <el-input v-model="form.username" autocomplete="off" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" label-width="90px">
                    <el-input v-model="form.email" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话" label-width="90px">
                    <el-input v-model="form.mobile" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogTableVisibleEdit = false">取 消</el-button>
                <el-button type="primary" @click="editUser()">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 编辑用户角色的弹窗 -->
        <el-dialog title="编辑用户" :visible.sync="dialogTableVisibleRole">
            <el-form :data="form">
                <el-form-item label="用户名" label-width="90px">
                    {{currentUsername}}
                </el-form-item>
                <el-form-item label="角色" label-width="90px">
                    <el-select v-model="currentRoleId" placeholder="请选择">
                        <el-option label="请选择" :value="-1"></el-option>
                        <el-option :label="item.roleName" :value="item.id" v-for="item in roleArr" :key="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogTableVisibleRole = false">取 消</el-button>
                <el-button type="primary" @click="setUserRole()">确 定</el-button>
            </div>
        </el-dialog>

    </el-card>
</template>

<script>
export default {
    name:'UsersLIst',
    data(){
        return {
            query: '',
            pagenumber: 1,
            pagesize: 4,
            userList: [],
            total: -1,
            dialogTableVisibleAdd: false,
            dialogTableVisibleEdit: false,
            dialogTableVisibleRole: false,
            form: {
                username:'',
                password:'',
                email:'',
                mobile:''
            },
            roleArr: [],
            currentUsername: '',
            currentRoleId: -1,
            currentUserId: -1
        }
    },
    mounted(){
        this.getUserList()
    },
    methods:{
        //获取用户列表
        async getUserList(){
            const response = await this.$http.get(`users?query=${this.query}&pagenum=${this.pagenumber}&pagesize=${this.pagesize}`)
            //获取响应信息(response)中的data对象和meta对象
            //data对象的users为用户列表
            //data对象的total为用户总数
            //meta对象的msg为提示信息
            //meta对象的status用于判断获取数据是否成功
            const {data:{users, total}, meta:{msg, status}} = response.data
            console.log(response)
            if(status === 200){
                this.userList = users
                this.total = total
            }else{
                this.$message.error(msg);
            }
        },
        //修改每页显示条目数后执行的操作
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.pagesize = val
            this.getUserList()
        },
        //翻页后的操作
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.pagenumber = val
            this.getUserList()
        },
        //模糊搜索用户
        searchUser(){
            this.getUserList()
        },
        //搜索输入框清空后执行的操作
        loadUserList(){
            this.query = ""
            this.getUserList()
        },
        //弹添加用户信息的弹窗
        addUserDialog(){
            this.form = {}
            this.dialogTableVisibleAdd = true
        },
        //添加用户
        async addUser(){
            const response = await this.$http.post('users', this.form)
            const {meta:{msg, status}} = response.data
            if(status === 201){
                this.$message.success(msg)
                this.dialogTableVisibleAdd = false
                this.getUserList()
                this.form = {}
            }else{
                this.$message.error(msg)
                this.form = {}
            }
        },
        //弹出删除用户的提示框
        deleteUserAlert(userId){
            this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(async () => {
                //如果点确定，那么发请求删除用户
                const response = await this.$http.delete(`users/${userId}`)
                if(response.data.meta.status === 200){
                    this.getUserList()
                    //弹消息
                    this.$message({
                        type: 'success',
                        message: response.data.meta.msg
                    })
                }
            }).catch(() => {
                //如果点取消，那么弹取消删除的消息
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        //弹编辑用户信息的弹窗
        editUserDialog(user){
            this.form = user
            this.dialogTableVisibleEdit=true
        },
        //编辑用户信息
        async editUser(){
            // editUserDialog()一定比本函数先执行，而在editUserDialog()中用户所有的信息(user)均已挂到form上
            // 此时在这里就可以直接用this.form.id取到用户id
            // 而表单 编辑用户的弹窗 也是用form对象收集数据的(见上面的 <!-- 编辑用户的弹窗 --> )
            // 所以请求体就直接将form对象传过去即可
            const response = await this.$http.put(`users/${this.form.id}`, this.form)
            if(response.data.meta.status === 200){
                this.dialogTableVisibleEdit=false
                this.getUserList()
                //弹消息
                this.$message({
                    type: 'success',
                    message: response.data.meta.msg
                })
            }
        },
        //修改用户状态
        changeMgState(user){
            this.$http.put(`users/${user.id}/state/${user.mg_state}`)
        },
        //弹编辑角色信息的弹窗
        async setRoleDialog(user){
            this.currentUsername = user.username
            this.currentUserId = user.id
            //获取当前用户角色id
            const responseUser = await this.$http.get(`users/${user.id}`)
            //获取所有角色
            const responseRoles = await this.$http.get('roles')
            this.currentRoleId = responseUser.data.data.rid
            this.roleArr = responseRoles.data.data
            this.dialogTableVisibleRole = true
        },
        async setUserRole(){
            const response = await this.$http.put(`users/${this.currentUserId}/role`, {rid:this.currentRoleId})
            if(response.data.meta.status === 200){
                this.dialogTableVisibleRole=false
                this.getUserList()
                //弹消息
                this.$message({
                    type: 'success',
                    message: response.data.meta.msg
                })
            }
        }
    }
}
</script>

<style>
    .box-card {
        height: 100%;
    }
    .input-search {
        width: 300px;
    }
    .search-row {
        margin-top: 20px;
    }
    .search-btn {
        margin-left: 5px;
    }
</style>