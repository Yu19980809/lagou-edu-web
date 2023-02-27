<template>
  <div class="role-list">
    <!-- 卡片组件 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 表单组件 -->
        <el-form ref="form" :model="form" :inline="true" class="demo-form-inline">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit" :disabled="isLoading">查询搜索</el-button>
            <el-button :disabled="isLoading" @click="onReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-button @click="handleAdd">添加角色</el-button>
      <!-- table 组件 -->
      <el-table :data="roles" style="width: 100%" v-loading="isLoading">
        <el-table-column prop="id" label="编号"></el-table-column>
        <el-table-column prop="name" label="角色名称"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            <span>{{ scope.row.createdTime | dateFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150px">
          <template slot-scope="scope">
            <div>
              <el-button type="text" @click="handleAllocate(scope.row)">分配菜单</el-button>
              <el-button type="text">分配资源</el-button>
            </div>
            <div>
              <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 对话框组件 -->
      <el-dialog
        title="添加角色"
        :visible.sync="dialogVisible"
        width="30%">
        <create-or-edit
        v-if="dialogVisible"
        @success="onSuccess"
        @cancel="dialogVisible = false"
        :is-edit="isEdit"
        :role-id="roleId">
        </create-or-edit>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getRoles, deleteRole } from '@/services/role'
import CreateOrEdit from './create-or-edit'

export default {
  name: 'RoleList',
  components: {
    CreateOrEdit
  },
  data () {
    return {
      // 表单数据
      form: {
        name: ''
      },
      // 所有角色
      roles: [],
      // 加载状态
      isLoading: false,
      // 对话框显示状态
      dialogVisible: false,
      // 记录状态为编辑还是添加
      isEdit: false,
      // 正在编辑的角色ID
      roleId: null
    }
  },
  created () {
    this.loadRoles()
  },
  methods: {
    // 查询按钮点击事件
    onSubmit () {
      console.log('search')
    },
    // 重置按钮点击事件
    onReset () {
      console.log('reset')
    },
    // 加载角色信息
    async loadRoles () {
      this.isLoading = true
      const { data } = await getRoles(this.form)
      this.roles = data.data.records
      this.isLoading = false
    },
    // 删除按钮点击事件
    async handleDelete (role) {
      this.$confirm(`确认删除角色 ${role.name} 吗？`, '删除提示')
        .then(async () => {
          await deleteRole(role.id)
          this.$message.success('删除成功')
          this.loadRoles()
        })
        .catch(err => {
          if (err && err.response) {
            this.$message.error('删除失败，请重试')
          } else {
            this.$message.info('已取消删除')
          }
        })
    },
    // 编辑按钮点击事件
    handleEdit (role) {
      this.dialogVisible = true
      this.isEdit = true
      this.roleId = role.id
    },
    // 添加角色按钮点击事件
    handleAdd () {
      this.dialogVisible = true
      this.isEdit = false
    },
    // 成功添加角色后的操作
    onSuccess () {
      // 关闭对话框
      this.dialogVisible = false
      // 刷新列表
      this.loadRoles()
    },
    // 分配菜单按钮点击事件
    handleAllocate (role) {
      // 跳转到分配页面
      this.$router.push({
        name: 'allocate-menu',
        params: {
          roleId: role.id
        }
      })
    }
  },
  filters: {
    // 日期过滤器
    dateFormat (date) {
      date = new Date(date)
      let month = date.getMonth()
      let day = date.getDate()
      let h = date.getHours()
      let m = date.getMinutes()
      let s = date.getSeconds()
      month = month < 10 ? ('0' + month) : month
      day = day < 10 ? ('0' + day) : day
      h = h < 10 ? ('0' + h) : h
      m = m < 10 ? ('0' + m) : m
      s = s < 10 ? ('0' + s) : s
      return `${date.getFullYear()}-${month}-${day} ${h}:${m}:${s}`
    }
  }
}
</script>

<style lang="scss" scoped></style>
