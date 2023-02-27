<template>
  <div class="menu-edit">
    <create-or-edit :isEdit="true"></create-or-edit>
  </div>
</template>

<script>
import createOrEdit from './components/create-or-edit'

export default {
  name: 'MwnuEdit',
  components: {
    createOrEdit
  }
}
</script>

<style lang="scss" scoped></style>
