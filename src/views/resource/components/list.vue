<template>
  <div class="resource-list">
    <!-- card 组件设置外部结构 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 行内表单组件 -->
        <el-form ref="form" :inline="true" :model="form" class="demo-form-inline">
          <el-form-item label="资源名称" prop="name">
            <el-input v-model="form.name" placeholder="资源名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="资源路径" prop="url">
            <el-input v-model="form.url" placeholder="资源路径" clearable></el-input>
          </el-form-item>
          <el-form-item label="资源分类" prop="categoryId">
            <el-select v-model="form.categoryId" clearable="">
              <el-option v-for="item in resourceCategories" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="onReset">重置</el-button>
            <el-button type="primary" @click="onSubmit" :disabled="isLoading">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- table 组件 -->
      <el-table :data="resources" style="width: 100%" v-loading="isLoading">
        <el-table-column type="index" label="编号" width="100px"></el-table-column>
        <el-table-column prop="name" label="资源名称"></el-table-column>
        <el-table-column prop="url" label="资源路径"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <!-- 设置过滤器，需要使用作用域插槽获取数据 -->
        <el-table-column label="添加时间">
          <template slot-scope="scope">
            <span>{{ scope.row.createdTime | dateFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="form.current"
        :page-sizes="[10, 20, 50]"
        :page-size="form.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        :disabled="isLoading">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getResourcePages, getResourceCategory } from '@/services/resource'

export default {
  name: 'ResourceList',
  data () {
    return {
      // 表单数据
      form: {
        // 当前显示的页号
        current: 1,
        // 每页显示的数据条数
        size: 10,
        // 资源名称
        name: '',
        // 资源地址
        url: '',
        // 资源分类ID
        categoryId: ''
      },
      // 数据总条数
      totalCount: 0,
      // 存储资源分类信息
      resourceCategories: '',
      // 保存当前的加载状态
      isLoading: false,
      // 存储资源数据
      resources: []
    }
  },
  created () {
    this.loadResources()
    this.loadResourceCategory()
  },
  methods: {
    // 请求资源数据
    async loadResources () {
      // 更新加载状态
      this.isLoading = true
      // 开始请求数据
      const { data } = await getResourcePages(this.form)
      if (data.code === '000000') {
        this.resources = data.data.records
        this.totalCount = data.data.total
        // 重置加载状态
        this.isLoading = false
      }
    },
    // 加载资源分类信息
    async loadResourceCategory () {
      const { data } = await getResourceCategory()
      if (data.code === '000000') {
        this.resourceCategories = data.data
      }
    },
    // 重置按钮点击事件
    onReset () {
      // 表单组件提供了 resetFields() ⽤于重置具有 prop 的表单项。
      this.$refs.form.resetFields()
    },
    // 查询按钮点击事件
    onSubmit () {
      // 请求数据
      this.form.current = 1
      this.loadResources()
    },
    // 页号变化时触发
    handleCurrentChange (val) {
      this.loadResources()
    },
    // 每页显示条数变化时触发
    handleSizeChange (val) {
      this.form.size = val
      // 由于修改了每页的条数，页号也会改变，故应该将页号还原为默认值：1
      this.form.current = 1
      this.loadResources()
    },
    // 编辑按钮点击事件
    handleEdit (rowData) {
      console.log(rowData)
    },
    // 删除按钮点击事件
    handleDelete (rowData) {
      console.log(rowData)
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
