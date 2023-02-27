<template>
  <div class="course-section">
    <el-card>
      <div slot="header">课程内容</div>
      <el-tree
        v-loading="isLoading"
        :data="sections"
        :props="defaultProps"
        draggable
        :allow-drop="handleAllowDrop"
        @node-drop="handleNodeDrop">
        <!-- 设置插槽，并通过插槽接收组件暴露的数据 -->
        <div class="inner" slot-scope="{ node, data }">
          <!-- 设置内容 -->
          <span>{{ node.label }}</span>
          <!-- section 结构 -->
          <span v-if="data.sectionName" class="actions">
            <el-button>编辑</el-button>
            <el-button>添加课时</el-button>
            <el-button>状态</el-button>
          </span>
          <!-- lesson 结构 -->
          <span v-else class="actions">
            <el-button>编辑</el-button>
            <el-button
              type="success"
              @click="$router.push({
                name: 'course-video',
                params: {
                  courseId
                },
                query: {
                  lessonId: data.id
                }
              })"
            >上传视频</el-button>
            <el-button>状态</el-button>
          </span>
        </div>
      </el-tree>
    </el-card>
  </div>
</template>

<script>
import { getSectionAndLesson, saveOrUpdateSection, saveOrUpdateLesson } from '@/services/course-section'

export default {
  name: 'CourseSection',
  props: {
    courseId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      // 课程数据
      sections: [],
      // 根据响应数据调整属性
      defaultProps: {
        children: 'lessonDTOS',
        label (data) {
          return data.sectionName || data.theme
        }
      },
      // 数据更新状态
      isLoading: false
    }
  },
  created () {
    this.loadSection()
  },
  methods: {
    // 加载课程内容
    async loadSection () {
      const { data } = await getSectionAndLesson(this.courseId)
      if (data.code === '000000') {
        // 保存数据
        this.sections = data.data
      }
    },
    // 判断节点是否能被放置
    handleAllowDrop (draggingNode, dropNode, type) {
      // 将拖拽限制在同级之前，所有type的值可以为 prev 和 next， 但是不能为 inner
      // 且某个章节下的课时不能放置到其他章节中去
      return type !== 'inner' && draggingNode.data.sectionId === dropNode.data.sectionId
    },
    // el-tree 的 node-drop 事件,设置节点拖动结束后的数据更新
    async handleNodeDrop (draggingNode, dropNode, type, event) {
      this.isLoading = true
      // 由于有很多章节和课时，需要对拖拽后的顺序进行更新
      // Promise.all() 可以批量处理异步请求
      try {
        await Promise.all(dropNode.parent.childNodes.map((item, index) => {
          // 先判断是章节排序请求还是课时排序请求，分开处理
          // 包含 lessonDTOS 字段的是章节，不包含则为课时
          if (draggingNode.data.lessonDTOS) {
            return saveOrUpdateSection({
              id: item.data.id,
              orderNum: index
            })
          } else {
            return saveOrUpdateLesson({
              id: item.data.id,
              orderNum: index
            })
          }
        }))
        this.$message.success('数据更新成功')
      } catch (err) {
        this.$message.error('数据更新失败', err)
      }
      this.isLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.inner {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ebeef5;
}
::v-deep .el-tree-node__content {
  height: auto;
}
</style>
