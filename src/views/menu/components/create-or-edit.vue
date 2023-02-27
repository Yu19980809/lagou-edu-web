<template>
  <div class="create-or-edit">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 设置标题 -->
        <span>{{ isEdit ? '标记菜单' : '添加菜单' }}</span>
      </div>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="菜单名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="菜单路径">
          <el-input v-model="form.href"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单">
          <el-select v-model="form.parentId" placeholder="请选择上级菜单">
            <el-option label="无上级菜单" :value="-1"></el-option>
            <el-option v-for="item in parentMenuList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item label="前端图标">
          <el-input v-model="form.icon"></el-input>
        </el-form-item>
        <el-form-item label="是否显示">
          <el-radio-group v-model="form.shown">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.orderNum" label="描述文字"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button v-if="!isEdit">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getEditMenuInfo, createOrUpdateMenu } from '@/services/menu'

export default {
  name: 'CreateOrEdit',
  // 通过 props 接收父组件传值，判断当前是哪种功能（添加或编辑）
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  created () {
    // 加载上级菜单信息
    this.loadMenuInfo()
  },
  data () {
    return {
      // 表单数据
      form: {
        parentId: '',
        name: '',
        href: '',
        icon: '',
        orderNum: 0,
        description: '',
        shown: true
      },
      // 上级菜单数据
      parentMenuList: []
    }
  },
  methods: {
    // 提交按钮点击事件
    async onSubmit () {
      // 1. 表单验证
      // 2. 发送请求
      const { data } = await createOrUpdateMenu(this.form)
      if (data.code === '000000') {
        this.$message.success('提交成功')
        this.$router.push('/menu')
      }
    },
    // 请求上级菜单数据
    async loadMenuInfo () {
      // 检测是否存在路由参数id，并进行处理
      const id = this.$route.params.id || -1
      const { data } = await getEditMenuInfo(id)
      // 如果存在 menuInfo，说明为编辑功能，更新展示数据
      if (data.data.menuInfo) {
        this.form = data.data.menuInfo
      }
      if (data.code === '000000') {
        // 将获取到的上级菜单信息存储下来
        this.parentMenuList = data.data.parentMenuList
        // 检测是否存在菜单数据menuInfo，如果存在，更新给this.form即可
        if (data.data.menuInfo) {
          this.form = data.data.menuInfo
        }
      }
    }
  }
}
</script>
