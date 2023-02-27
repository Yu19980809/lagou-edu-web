<template>
  <div class="course-video">
    <el-card>
      <div slot="header">课程相关信息</div>
      <el-form>
        <el-form-item label="视频上传">
          <input type="file" ref="video-file">
        </el-form-item>
        <el-form-item label="封面上传">
          <input type="file" ref="image-file">
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="handleUpload"
            :disabled="isUploading"
          >开始上传</el-button>
          <el-button @click="$router.push({name: 'course-section', params: {courseId}})">返回</el-button>
        </el-form-item>
        <el-form-item>
          <p v-if="uploadPercent !== 0">视频上传：{{ uploadPercent }}%</p>
          <p v-if="isUploadSuccess">视频转码：{{ isTranscodeSuccess ? '完成' : '正在转码中...' }}</p>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
/* eslint-disable */
import {
  aliyunImageUploadAddressAndAuth,
  aliyunVideoUploadAddressAndAuth,
  aliyunVideoTranscode,
  aliyunVideoTranscodePercent
} from '@/services/aliyun-upload'

export default {
  name: 'CourseVideo',
  props: {
    courseId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      // 保存上传实例
      uploader: null,
      // 图片上传后的地址，由于视频上传请求
      imageURL: '',
      // 上传视频的ID
      videoId: '',
      // 上传进度
      uploadPercent: 0,
      // 标记是否上传成功
      isUploadSuccess: false,
      // 标记是否转码成功
      isTranscodeSuccess: false,
      // 标记上传状态
      isUploading: false
    }
  },
  created () {
    // 初始化视频上传实例
    this.initUploader()
  },
  methods: {
    // 初始化视频上传实例
    initUploader () {
      this.uploader = new window.AliyunUpload.Vod({
        // userID，必填，只需有值即可。
        userId: '1618139964448548',
        // 上传到视频点播的地域，默认值为'cn-shanghai'，
        // eu-central-1，ap-southeast-1
        region: '',
        // 分片大小默认1 MB，不能小于100 KB，此参数单位默认为 B
        partSize: 1048576,
        // 并行上传分片个数，默认5
        parallel: 5,
        // 网络原因失败时，重新上传次数，默认为3
        retryCount: 3,
        // 网络原因失败时，重新上传间隔时间，默认为2秒
        retryDuration: 2,
        // 开始上传
        onUploadstarted: async uploadInfo => {
          //  声明变量存储得到的上传凭证
          let uploadAddressAndAuth = null
          // 检测是图片还是视频
          if (uploadInfo.isImage) {
            // 图片处理
            const { data } = await aliyunImageUploadAddressAndAuth()
            if (data.code === '000000') {
              uploadAddressAndAuth = data.data
              this.imageURL = uploadAddressAndAuth.imageURL
            }
          } else {
            // 视频处理
            const { data } = await aliyunVideoUploadAddressAndAuth({
              fileName: uploadInfo.file.name,
              imageURL: this.imageURL
            })
            if (data.code === '000000') {
              uploadAddressAndAuth = data.data
              this.videoId = data.data.videoId
            }
          }
          // 设置凭证和地址,此步设置完毕，上传进度开始执行
          this.uploader.setUploadAuthAndAddress(
            uploadInfo,
            uploadAddressAndAuth.uploadAuth,
            uploadAddressAndAuth.uploadAddress,
            uploadAddressAndAuth.imageId || uploadAddressAndAuth.videoId
          )
        },
        // 文件上传成功
        onUploadSucceed: function (uploadInfo) {
        },
        // 文件上传失败
        onUploadFailed: function (uploadInfo, code, message) {
        },
        // 文件上传进度，单位：字节
        onUploadProgress: async (uploadInfo, totalSize, loadedPercent) => {
          // 这里的 loadedPercent 就是上传进度，值为一个小数
          if (!uploadInfo.isImage) {
            this.uploadPercent = Math.floor(loadedPercent * 100)
          }
        },
        // 上传凭证或STS token超时
        onUploadTokenExpired: function (uploadInfo) {
        },
        // 全部文件上传结束
        onUploadEnd: async uploadInfo => {
          this.isUploadSuccess = true
          const lessonId = this.$route.query.lessonId
          // 发送视频转码请求
          const { data } = await aliyunVideoTranscode({
            lessonId,
            coverImageUrl: this.imageURL,
            fileId: this.videoId,
            fileName: this.$refs['video-file'].files[0].name
          })
          if (data.code === '000000') {
            // 轮询转码进度
            const timer = setInterval(async () => {
              const { data } = await aliyunVideoTranscodePercent(lessonId)
              if (data.code === '000000') {
                if (data.data === 100) {
                  this.$message.success('视频转码成功')
                  this.isTranscodeSuccess = true
                  this.isUploading = false
                  clearInterval(timer)
                }
              }
            }, 1000)
          }
        }
      })
    },
    // 上传按钮点击事件
    handleUpload () {
      this.isUploading = true
      // 状态重置
      this.uploadPercent = 0
      this.isUploadSuccess = false
      this.isTranscodeSuccess = false
      // 获取上传的文件（视频、图片）
      const videoFile = this.$refs['video-file'].files[0]
      const imageFile = this.$refs['image-file'].files[0]
      const uploader = this.uploader
      // 将要上传的文件添加到上传列表中
      uploader.addFile(imageFile)
      uploader.addFile(videoFile)
      // 开始上传
      uploader.startUpload()
    }
  }
}
</script>

<style lang="scss" scoped></style>
