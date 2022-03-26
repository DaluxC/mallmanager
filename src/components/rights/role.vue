<template>
    <el-card class="box-card">
        <!-- 面包屑 -->
        <my-breadcrumb level1='权限管理' level2='角色列表'></my-breadcrumb>

        <!-- 添加角色 -->
        <el-button plain class="add-button">添加角色</el-button>

        <!-- 角色列表 -->
         <el-table
        :data="roleList"
        style="width: 100%"
        class="role-list">
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <span v-if="scope.row.children.length === 0">未分配权限</span>
                    <!-- 当前角色[scope.row 代表scope(roleList)中的每个角色]有多少一级权限(children)整个列表就有多少行(el-row) -->
                    <el-row v-for="item1 in scope.row.children" :key="item1.id">
                        <!-- 列表行的第一列：展示一级权限的标签 -->
                        <el-col :span="4">
                            <el-tag @close="deleteRight(scope.row, item1.id)" closable>{{item1.authName}}</el-tag>
                            <i class="el-icon-arrow-right"></i>
                        </el-col>
                        <!-- 列表行的第二列：展示一级权限的children(二级权限与三及权限) -->
                        <el-col :span="20">
                            <!-- 一级权限有多少子权限(children)第二列就有多少行 -->
                            <el-row v-for="item2 in item1.children" :key="item2.id">
                                <!-- 第二列划的行的第一列：展示二级权限的标签 -->
                                <el-col :span="4">
                                    <el-tag @close="deleteRight(scope.row, item2.id)" type='success' closable>{{item2.authName}}</el-tag>
                                    <i class="el-icon-arrow-right"></i>
                                </el-col>
                                <!-- 第二列划的行的第二列：展示二级权限的children(三及权限) -->
                                <el-col :span="20">
                                    <el-tag @close="deleteRight(scope.row, item3.id)" type='warning' closable v-for="item3 in item2.children" :key="item3.id">
                                        {{item3.authName}}
                                    </el-tag>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                    <!-- 
                        大概是这么个情况

                                    列表行第一列  |            列表行第二列
                                 ________________|_______________________________________
                            。   |               |               |  三级权限的标签       |
                            。   |               | 二级权限的标签 |______________________|
                            。   |               |               | 更多三级权限的标签……  |
                        列表行   | 一级权限的标签 |_______________|______________________|
                            。   |               |               |  三级权限的标签       |
                            。   |               | 二级权限的标签 |______________________|
                            。   |               |               | 更多三级权限的标签……  |
                            。   |_______________|_______________|______________________|
                     -->
                </template>
            </el-table-column>
            <el-table-column
            label="#"
            type="index">
            </el-table-column>
            <el-table-column
            label="角色名称"
            prop="roleName"
            width="200">
            </el-table-column>
            <el-table-column
            label="角色描述"
            prop="roleDesc"
            width="200">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-row>
                        <el-button type="primary" icon="el-icon-edit" circle plain></el-button>
                        <el-button type="danger" icon="el-icon-delete" circle plain></el-button>
                        <el-button type="success" @click="setRightDialog(scope.row)" icon="el-icon-check" circle plain></el-button>
                    </el-row>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="修改权限" :visible.sync="dialogFormVisible">
            <el-tree
            ref="treeList"
            :data="rightList"
            show-checkbox
            node-key="id"
            default-expand-all
            :default-checked-keys="arrChecked"
            :props="defaultProps">
            </el-tree>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="setRoleRight()">确 定</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>

<script>
export default {
    name:'RoleList',
    data(){
        return {
            currentRoleId:-1,
            roleList:[],
            rightList:[],
            arrChecked:[],
            defaultProps: {
                children: 'children',
                label: 'authName'
            },
            dialogFormVisible:false
        }
    },
    mounted(){
        this.getRoleList()
    },methods:{
        //获取角色列表
        async getRoleList(){
            const response = await this.$http.get('roles')
            const {data, meta:{msg, status}} = response.data
            if(status === 200){
                this.roleList = data
                console.log(this.roleList)
            }else{
                this.$message.error(msg)
            }
        },
        //删角色权限
        async deleteRight(role, rightId){
            const response = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
            if(response.data.meta.status === 200){
                role.children = response.data.data
                this.$message.success(response.data.meta.msg)
            }else{
                this.$message.error(response.data.meta.msg)
            }
        },
        //弹添加权限的弹窗
        async setRightDialog(role){
            this.arrChecked = []
            this.currentRoleId = role.id
            this.dialogFormVisible=true
            const response = await this.$http.get('rights/tree')
            this.rightList = response.data.data
            
            //获取当前角色的所有权限(当前角色的children属性)，elementui的树形结构根据id值来执行那些项需要默认选中
            //这里需要让当前角色所拥有的权限默认选中，将当前角色的所有权限的id放入arrChecked，传给default-checked-keys属性
            //只用选中三级权限就行了，一级二级一选中下边的项就全选了
            role.children.forEach(item1 => {
                item1.children.forEach(item2 => {
                    item2.children.forEach(item3 => {
                        this.arrChecked.push(item3.id)
                    })
                })
            })
        },
        //修改角色权限
        async setRoleRight(){
            let checkedKeys = this.$refs.treeList.getCheckedKeys()
            let halfCheckedKeys = this.$refs.treeList.getHalfCheckedKeys()
            let keys = [...checkedKeys, ...halfCheckedKeys]
            const response = await this.$http.post(`roles/${this.currentRoleId}/rights` ,{rids:keys.join(',')})
            if(response.data.meta.status === 200){
                this.getRoleList()
                this.dialogFormVisible=false
                this.$message.success(response.data.meta.msg)
            }else{
                this.$message.error(response.data.meta.msg)
            }
        }
    }
}
</script>

<style>
    .box-card {
        height: 100%;
    }
    .add-button {
        margin-top: 20px;
    }
    .role-list {
        margin-top: 20px;
    }
</style>