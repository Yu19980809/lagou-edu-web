<template>
  <div class="user-list">
    <el-card>
      <div slot="header">
        <!-- 行内表单 -->
        <el-form ref="filter-form" :inline="true" :model="filterParams">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="filterParams.phone"></el-input>
          </el-form-item>
          <el-form-item label="注册时间" prop="rangeDate">
            <el-date-picker
              v-model="filterParams.rangeDate"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button :disabled="isLoading" @click="handleReset">重置</el-button>
            <el-button type="primary" :disabled="isLoading" @click="handleQuery">查询</el-button>
          </el-form-item>
        </el-form>
        <!-- table 组件 -->
        <el-table
          :data="users"
          style="width: 100%"
          v-loading="isLoading">
          <el-table-column
            prop="id"
            label="用户ID"
            width="150">
          </el-table-column>
          <el-table-column
            prop="name"
            label="头像"
            width="100">
            <template slot-scope="scope">
              <img width="30px" :src="scope.row.portrait || 'http178s://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'">
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="用户名">
          </el-table-column>
          <el-table-column
            prop="phone"
            label="手机号">
          </el-table-column>
          <el-table-column
            prop="createdTime"
            label="注册时间">
            <!-- ⽤户状态操作（服务端没有开放权限，只能演示） -->
          </el-table-column>
          <el-table-column
            prop="name"
            label="状态"
            width="80">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                active-value="ENABLE"
                active-color="#13ce66"
                inactive-value="DISABLE"
                inactive-color="#ff4949"
                @change="handleForbidUser(scope.row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="handleSelectRole(scope.row)">分配角色</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- Dialog 组件 -->
        <el-dialog
          title="分配角色"
          :visible.sync="dialogVisible"
          width="50%">
            <el-select v-model="roleIdList" placeholder="请选择">
              <el-option
                v-for="item in roles"
                :key="item.value"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="onSubmit">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getUserPages, forbidUser } from '@/services/user'
import { getAllRoles, allocateUserRoles, getUserRoles } from '@/services/role'

export default {
  name: 'UserList',
  data () {
    return {
      // 用户信息
      users: [],
      // 表单数据
      filterParams: {
        currentPage: 1,
        pageSize: 100,
        phone: '',
        startCreateTime: '',
        endCreateTime: '',
        rangeDate: []
      },
      // 加载状态
      isLoading: false,
      // 对话框显示状态
      dialogVisible: false,
      // 所有角色信息
      roles: [],
      // 选中的角色
      roleIdList: [],
      // 当前分配角色的ID
      currentRoleId: null
    }
  },
  created () {
    // 加载用户信息
    this.loadUsers()
  },
  methods: {
    // 加载用户信息
    async loadUsers () {
      this.isLoading = true
      const { rangeDate } = this.filterParams
      if (rangeDate && rangeDate.length) {
        this.filterParams.startCreateTime = rangeDate[0]
        this.filterParams.endCreateTime = rangeDate[1]
      } else {
        this.filterParams.startCreateTime = ''
        this.filterParams.endCreateTime = ''
      }
      const { data } = await getUserPages(this.filterParams)
      this.users = data.data.records
      this.isLoading = false
    },
    // 封禁用户
    async handleForbidUser (user) {
      const { data } = await forbidUser(user.id)
      console.log(data)
    },
    // 查询按钮点击事件
    handleQuery () {
      this.filterParams.currentPage = 1
      this.loadUsers()
    },
    // 重置按钮点击事件
    handleReset () {
      this.$refs['filter-form'].resetFields()
      this.loadUsers()
    },
    // 分配角色按钮点击事件
    async handleSelectRole (userData) {
      this.dialogVisible = true
      // 保存当前操作的用户的ID
      this.currentRoleId = userData.id
      // 加载角色列表
      const { data } = await getAllRoles()
      if (data.code === '000000') {
        this.roles = data.data
      }
      // 根据用户ID请求角色信息
      const { data: data2 } = await getUserRoles(userData.id)
      // 遍历得到的角色列表，将 ID 组成数据替换给 roleIdList
      if (data2.code === '000000') {
        this.roleIdList = data2.data.map(item => item.id)
      }
    },
    // 分配角色页面的确定按钮点击事件
    async onSubmit () {
      // 提交请求
      const { data } = await allocateUserRoles({
        userId: this.currentRoleId,
        roleIdList: this.roleIdList
      })
      if (data.code === '000000') {
        this.$message.success('分配角色成功')
        this.dialogVisible = false
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
