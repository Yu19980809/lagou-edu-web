<template>
  <div class="menu">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button @click="$router.push({name: 'menu-create'})">添加菜单</el-button>
      </div>
      <!-- 菜单列表展示 -->
      <el-table
        :data="menus"
        style="width: 100%">
        <el-table-column
          label="编号"
          type="index">
        </el-table-column>
        <el-table-column
          prop="name"
          label="菜单名称">
        </el-table-column>
        <el-table-column
          prop="level"
          label="菜单级数">
        </el-table-column>
        <el-table-column
          prop="icon"
          label="前端图标">
        </el-table-column>
        <el-table-column
          prop="orderNum"
          label="排序">
        </el-table-column>
        <el-table-column
          label="操作"
          width="180">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getAllMenu, deleteMenu } from '@/services/menu'

export default {
  name: 'Menu',
  created () {
    // 加载所有菜单信息
    this.loadAllMenu()
  },
  data () {
    return {
      menus: []
    }
  },
  methods: {
    // 加载所有菜单信息
    async loadAllMenu () {
      const { data } = await getAllMenu()
      if (data.code === '000000') {
        this.menus = data.data
      }
    },
    // 编辑按钮点击事件
    handleEdit (rowData) {
      // 导航到菜单编辑页
      this.$router.push({
        name: 'menu-edit',
        params: {
          id: rowData.id
        }
      })
    },
    // 删除按钮点击事件
    handleDelete (rowData) {
      this.$confirm('确认删除吗？', '删除提示')
        .then(async () => {
          // 发送删除请求
          const { data } = await deleteMenu(rowData.id)
          if (data.code === '000000') {
            this.$message.success('删除成功')
            // 更新数据列表
            this.loadAllMenu()
          }
        })
        .catch(() => {
          // 取消提示
          this.$message.info('已取消删除')
        })
    }
  }
}
</script>

<style lang="scss" scoped></style>
