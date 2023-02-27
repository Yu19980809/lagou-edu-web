<template>
  <div class="resource">
    <!-- 引入资源列表组件 -->
    <resource-list></resource-list>
  </div>
</template>

<script>
import ResourceList from './components/list'

export default {
  name: 'Resource',
  components: {
    ResourceList
  }
}
</script>

<style lang="scss" scoped></style>
