<template>
  <h1>
    <course-list></course-list>
  </h1>
</template>

<script>
import CourseList from './components/list'

export default {
  name: 'Course',
  components: {
    CourseList
  }
}
</script>

<style lang="scss" scoped></style>
