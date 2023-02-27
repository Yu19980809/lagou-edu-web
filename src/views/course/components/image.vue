<template>
  <div class="course-iamge">
    <el-form-item label="课程封面">
      <!-- 进度条组件 -->
      <el-progress
        type="circle"
        :percentage="percentage"
        width="178"
        v-if="isUploading"
        :status="percentage === 100 ? 'success' : 'undefined'">
      </el-progress>
      <!-- 自定义上传 -->
      <el-upload
        v-else
        class="avatar-uploader"
        action="https://jsonplaceholder.typicode.com/posts/"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
        :http-request="handleUpload">
        <!-- 图片预览 -->
        <img v-if="previewUrl" :src="previewUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-form-item>
  </div>
</template>

<script>
import { uploadCourseImage } from '@/services/course'

export default {
  name: 'CourseImage',
  props: {
    // 接收父组件数据
    value: {
      type: String
    },
    // 限制上传大小
    limit: {
      type: Number,
      default: 2
    }
  },
  data () {
    return {
      imageUrl: '',
      // 保存下载状态
      isUploading: false,
      // 图片上传进度百分比
      percentage: 0
    }
  },
  computed: {
    previewUrl () {
      return this.imageUrl || this.value
    }
  },
  methods: {
    // 文件上传成功时触发
    handleAvatarSuccess (res, file) {
      // 保存预览图片地址
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    // 文件上传之前进行规则校验
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < this.limit
      if (!isJPG) {
        this.$message.error('上传的图片只能是 JPG 格式')
      }
      if (!isLt2M) {
        this.$message.error(`上传头像图片大小不能超过 ${this.limit}MB`)
      }
      return isJPG && isLt2M
    },
    // 自定义文件上传操作
    async handleUpload (options) {
      // 展示进度条
      this.isUploading = true
      // 创建 FormData 对象保存数据
      const fd = new FormData()
      // 添加数据的键要根据接口文档设置
      fd.append('file', options.file)
      // 发送请求.并设置回调进行进度百分比计算
      const { data } = await uploadCourseImage(fd, (event) => {
        this.percentage = Math.floor(event.loaded / event.total * 100)
      })
      if (data.code === '000000') {
        // 上传成功后，将数据通过自定义事件传递给父组件
        this.$emit('input', data.data.name)
        this.$message.success('上传成功')
        // 关闭进度条
        this.isUploading = false
        // 上传成功后，设置进度信息归零，避免下次上传出现回退效果
        this.percentage = 0
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// 只有作⽤于⾮⼦组件根元素的选择器才需要设置 ::v-deep
::v-deep .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
::v-deep .avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
