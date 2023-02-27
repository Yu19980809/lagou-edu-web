// 公共组件目录
<template>
  <div ref="editor" class="text-editor"></div>
</template>

<script>
// 引入富文本编辑器
import E from 'wangeditor'

export default {
  name: 'TextEditor',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  // 由于需要进行 DOM 操作，使用 mounted 钩子
  mounted () {
    // 初始化富文本编辑器
    this.initEditor()
  },
  data () {
    return {
      editor: null,
      // 要编辑的数据是否加载完毕
      isLoded: false
    }
  },
  watch: {
    value () {
      // 编辑数据加载成功后，为富⽂本编辑器更新初始内容即可
      if (!this.isLoded) {
        this.editor.txt.html(this.value)
        this.isLoded = true
      }
    }
  },
  methods: {
    // 初始化富文本编辑器
    initEditor () {
      const editor = new E(this.$refs.editor)
      // 设置回调,将输入内容传回给父组件
      editor.config.onchange = value => {
        this.$emit('input', value)
      }
      editor.create()
      // 初始化后设置内容
      editor.txt.html(this.value)
      // 将富⽂本编辑器实例保存给 this 以便在 watch 中操作
      this.editor = editor
    }
  }
}
</script>

<style lang="scss" scoped></style>
