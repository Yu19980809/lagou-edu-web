<template>
  <div class="role">
    <!-- 引入角色列表组件 -->
    <role-list></role-list>
  </div>
</template>

<script>
import RoleList from './components/list'

export default {
  name: 'Role',
  components: {
    RoleList
  }
}
</script>

<style lang="scss" scoped></style>
