<template>
  <div class="login">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" label-position="top">
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="isLoginLoading" @click="onSubmit">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { login } from '@/services/user'

export default {
  name: 'Login',
  data () {
    return {
      form: {
        phone: '18201288771',
        password: '111111'
      },
      // 规则对象
      rules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1\d{10}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '密码长度为6到18个字符', trigger: 'blur' }
        ]
      },
      // 记录当前是否处于登录请求状态，默认为false
      isLoginLoading: false
    }
  },
  methods: {
    // 登录按钮点击事件
    async onSubmit () {
      try {
        // 1. 表单验证
        await this.$refs.form.validate()

        // 2. 发送请求
        // 先设置登录按钮为加载状态（禁用），避免多次点击导致重复发送请求
        this.isLoginLoading = true
        const { data } = await login(this.form)
        // 请求发送后恢复为可用状态
        this.isLoginLoading = false

        // 3. 响应处理
        // 3.1. 失败时进行提示
        if (data.state !== 1) {
          return this.$message.error(data.message)
        }
        // 3.2. 成功后跳转路由(使用编程式导航$router.push())
        // 1. 如果路由信息中存在 redirect ，则跳转到这个路由
        // 2. 如果不存在，说明是正常登录，跳转到首页 home 即可
        // 同时记录下登录状态，存储到 vuex 中
        // console.log(data)
        this.$store.commit('setUser', data.content)
        this.$router.push(this.$route.query.redirect || '/')
        this.$message.success('登录成功')
      } catch (err) {
        // 设置校验失败后的提示
        console.log('没有通过校验')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  .el-form {
    background-color: #fff;
    width: 300px;
    padding: 20px;
    border-radius: 10px;

    .el-button {
      width: 100%;
    }
  }
}
</style>
