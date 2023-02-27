<template>
  <div class="create-or-edit">
    <el-form>
      <el-form-item label="角色名称">
        <el-input v-model="role.name"></el-input>
      </el-form-item>
      <el-form-item label="角色编码">
        <el-input v-model="role.code"></el-input>
      </el-form-item>
      <el-form-item label="角色描述">
        <el-input v-model="role.description"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="onCancel">取消</el-button>
        <el-button type="primary" @click="onSubmit">确认</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { createOrUpdateRole, getRoleById } from '@/services/role'

export default {
  name: 'CreateOrEdit',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    roleId: {
      type: Number
    }
  },
  data () {
    return {
      role: {
        code: '',
        name: '',
        description: ''
      }
    }
  },
  created () {
    if (this.isEdit) {
      // 加载正在编辑的用户的信息
      this.loadRole()
    }
  },
  methods: {
    // 确认按钮点击事件
    async onSubmit () {
      // 1. 表单验证
      // 2. 发送请求
      const { data } = await createOrUpdateRole(this.role)
      if (data.code === '000000') {
        // 成功，这时应关闭对话框并刷新列表，但这些都是⽗组件 list 的功能，
        // 这时就需要⽗⼦组件通信（⼦传⽗）了
        this.$message.success('添加成功')
        // 子组件触发自定义事件
        this.$emit('success')
        // 清空内容
        this.role = {}
      }
    },
    // 取消按钮点击事件
    onCancel () {
      this.$emit('cancel')
      this.role = {}
    },
    // 加载角色信息
    async loadRole () {
      const { data } = await getRoleById(this.roleId)
      if (data.code === '000000') {
        this.role = data.data
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
