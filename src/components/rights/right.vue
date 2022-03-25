<template>
    <el-card class="box-card">
        <!-- 面包屑 -->
        <my-breadcrumb level1='权限管理' level2='权限列表'></my-breadcrumb>

        <el-table
        :data="rightList"
        height="520"
        border
        style="width: 100%;margin-top: 20px">
            <el-table-column
            type="index"
            label="#"
            width="50">
            </el-table-column>
            <el-table-column
            prop="authName"
            label="权限名称"
            width="200">
            </el-table-column>
            <el-table-column
            prop="path"
            label="路径"
            width="200">
            </el-table-column>
            <el-table-column
            label="层级">
                <template slot-scope="scope">
                    <span v-if="scope.row.level === '0'">一级</span>
                    <span v-if="scope.row.level === '1'">二级</span>
                    <span v-if="scope.row.level === '2'">三级</span>
                </template>
            </el-table-column>
        </el-table>

    </el-card>
</template>

<script>
export default {
    name:'UserRight',
    data(){
        return {
            rightList: []
        }
    },
    mounted() {
        this.getRightList()
    },
    methods:{
        async getRightList(){
            const response = await this.$http.get('rights/list')
            const {data, meta:{msg, status}} = response.data
            if(status === 200){
                this.rightList = data
                console.log(this.rightList)
            }else{
                this.$message.error(msg);
            }
        }
    }
}
</script>

<style>
    .box-card {
        height: 100%;
    }
</style>