<template>
  <div class="menu-create">
    <create-or-edit></create-or-edit>
  </div>
</template>

<script>
import createOrEdit from './components/create-or-edit'

export default {
  name: 'MenuCreate',
  components: {
    createOrEdit
  }
}
</script>

<style lang="scss" scoped></style>
