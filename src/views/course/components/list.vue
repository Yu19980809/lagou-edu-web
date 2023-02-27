<template>
  <div class="course-list">
    <el-card>
      <!-- 行内表单 -->
      <el-form ref="form" :inline="true" :model="filterParams">
        <el-form-item label="课程名称" prop="courseName">
          <el-input v-model="filterParams.courseName"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="filterParams.status">
            <el-option label="全部" value=""></el-option>
            <el-option label="上架" value="1"></el-option>
            <el-option label="下架" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button :disabled="isLoading" @click="handleReset">重置</el-button>
          <el-button type="primary" :disabled="isLoading" @click="handleQuery">查询</el-button>
        </el-form-item>
      </el-form>
      <!-- 添加课程按钮 -->
      <el-button
        style="float: right; margin-top: -62px;"
        type="primary"
        @click="$router.push({name: 'course-create'})"
      >添加课程</el-button>
      <!-- table 组件 -->
      <el-table
        :data="courses"
        style="width: 100%; margin-bottom: 20px;"
        v-loading="isLoading">
        <el-table-column
          prop="id"
          label="ID"
          width="100">
        </el-table-column>
        <el-table-column
          prop="courseName"
          label="课程名称"
          width="230">
        </el-table-column>
        <el-table-column
          prop="price"
          label="价格">
        </el-table-column>
        <el-table-column
          prop="sortNum"
          label="排序">
        </el-table-column>
        <el-table-column
          prop="status"
          label="上架状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
              :disabled="scope.row.isStatusLoading"
              @change="onStateChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="price"
          label="操作"
          width="200"
          align="center">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.row)">编辑</el-button>
            <el-button @click="handleSection(scope.row)">内容管理</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 组件 -->
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page.sync="filterParams.currentPage"
        layout="prev, pager, next"
        :total="totalCount"
        :disabled="isLoading">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getQueryCourses, changeState } from '@/services/course'

export default {
  name: 'CourseList',
  data () {
    return {
      // 表单数据
      filterParams: {
        currentPage: 1,
        pageSize: 10,
        courseName: '',
        status: ''
      },
      // 加载状态
      isLoading: false,
      // 课程列表数据
      courses: [],
      // 数据总条数
      totalCount: 0
    }
  },
  created () {
    // 加载课程信息
    this.loadCourses()
  },
  methods: {
    // 加载课程信息
    async loadCourses () {
      this.isLoading = true
      const { data } = await getQueryCourses(this.filterParams)
      if (data.code === '000000') {
        // 给数据设置属性，标识状态是否处于上下架状态切换中（默认为 false）
        data.data.records.forEach(item => {
          item.isStatusLoading = false
        })
        // 保存课程信息
        this.courses = data.data.records
        this.totalCount = data.data.total
      }
      this.isLoading = false
    },
    // 重置按钮点击事件
    handleReset () {
      this.$refs.form.resetFields()
    },
    // 查询按钮点击事件
    handleQuery () {
      this.filterParams.currentPage = 1
      this.loadCourses()
    },
    // 分页页码变化时触发
    handleCurrentChange (page) {
      this.filterParams.currentPage = page
      this.loadCourses()
    },
    // 上下架按钮切换时触发
    async onStateChange (course) {
      // 请求发送前，更改课程操作状态
      course.isStatusLoading = true
      // 发送请求，进行状态切换
      const { data } = await changeState({
        courseId: course.id,
        status: course.status
      })
      if (data.code === '000000') {
        this.$message.success(`${course.status === 0 ? '下架' : '上架'}成功`)
        // 请求完毕。还原课程操作状态
        course.isStatusLoading = false
      }
    },
    // 编辑按钮点击事件按
    handleEdit (course) {
      this.$router.push({
        name: 'course-edit',
        params: {
          courseId: course.id
        }
      })
    },
    // 内容管理按钮点击事件
    handleSection (course) {
      this.$router.push({
        name: 'course-section',
        params: {
          courseId: course.id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-card {
  margin-bottom: 20px;
}
</style>
