<template>
  <div class="allocate-menu">
    <el-card>
      <!-- 树形组件 -->
      <el-tree
      ref="menu-tree"
      node-key="id"
      :data="menus"
      :props="defaultProps"
      show-checkbox
      :default-expand-all="true"
      :default-checked-keys="checkedKeys">
      </el-tree>
      <div style="margin: 20px;">
        <el-button @click="resetChecked">清空</el-button>
        <el-button type="primary" @click="onSave">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getMenuNodeList, allocateRoleMenus, getRoleMenus } from '@/services/menu'

export default {
  name: 'AllocateMenu',
  props: {
    roleId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      menus: [],
      defaultProps: {
        children: 'subMenuList',
        label: 'name'
      },
      // 存储选择的数据id
      checkedKeys: []
    }
  },
  created () {
    // 加载所有菜单
    this.loadMenus()
    // 加载角色拥有的菜单列表
    this.loadRoleMenus()
  },
  methods: {
    // 加载所有菜单
    async loadMenus () {
      const { data } = await getMenuNodeList()
      if (data.code === '000000') {
        // 绑定数据
        this.menus = data.data
      }
    },
    // 加载角色拥有的菜单列表
    async loadRoleMenus () {
      const { data } = await getRoleMenus(this.roleId)
      if (data.code === '000000') {
        // 获取选中的数据
        this.getCheckedKeys(data.data)
      }
    },
    // 数据筛选功能
    getCheckedKeys (menus) {
      menus.forEach(menu => {
        // 检测是否存在子数据，若有，递归查找
        if (menu.subMenuLlist) {
          return this.getCheckedKeys(menu.subMenuLlist)
        }
        // 存储选中的数据ID
        if (menu.selected) {
          this.checkedKeys = [...this.checkedKeys, menu.id]
        }
      })
    },
    // 保存按钮点击事件
    async onSave () {
      const { data } = await allocateRoleMenus({
        roleId: this.roleId,
        menuIdList: this.$refs['menu-tree'].getCheckedKeys()
      })
      if (data.code === '000000') {
        // 信息提示
        this.$message.success('分配菜单成功')
        // 跳转回角色列表页面
        this.$router.push('/role')
      }
    },
    // 清空按钮点击事件
    resetChecked () {
      this.$refs['menu-tree'].setCheckedKeys([])
    }
  }
}
</script>

<style lang="scss" scoped></style>
