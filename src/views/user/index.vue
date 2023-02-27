<template>
  <div class="user">
    <!-- 引入用户列表组件 -->
    <user-list></user-list>
  </div>
</template>

<script>
import UserList from './components/list'

export default {
  name: 'User',
  components: {
    UserList
  }
}
</script>

<style lang="scss" scoped></style>
