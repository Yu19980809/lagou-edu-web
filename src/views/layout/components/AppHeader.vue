<template>
  <div class="app-header">
    <!-- 左侧面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 右侧用户信息展示 -->
    <el-dropdown>
      <span class="el-dropdown-link">
        <!-- 用户头像，使用了 Avatar 组件 -->
        <el-avatar size="small" :src="userInfo.portrait"></el-avatar>
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>{{ userInfo.userName }}</el-dropdown-item>
        <el-dropdown-item divided @click.native="handleLogout">退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { getUserInfo } from '@/services/user'

export default {
  name: 'AppHeader',
  // 实例创建时请求数据
  created () {
    // 不建议在钩子函数中直接书写逻辑，应该封装到 methods 中
    this.loadUserInfo()
  },
  data () {
    return {
      // 存储用户信息
      userInfo: {}
    }
  },
  methods: {
    // 加载用户信息
    async loadUserInfo () {
      // 调用方法请求用户信息
      const { data } = await getUserInfo()
      // 保存在 data 数据中
      this.userInfo = data.content
    },
    // 退出按钮点击事件
    handleLogout () {
      this.$confirm('确认退出吗？', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 确认执行的操作
        this.$message.success('退出成功！')
        // 删除 store 中的用户信息
        this.$store.commit('setUser', null)
        // 跳转到登录界面
        this.$router.push('/login')
      }).catch(() => {
        // 取消执行的操作
        this.$message.info('已取消退出！')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-header {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .el-dropdown-link {
    display: flex;
    align-items: center;
  }
}
</style>
