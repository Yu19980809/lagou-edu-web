import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'
import { stringify } from 'qs'

// 新建一个 axios 实例
const request = axios.create({})

// 封装函数，用于检测URL基地址
function getBaseURL (url) {
  if (url.startsWith('/boss')) {
    return 'http://eduboss.lagounews.com'
  } else {
    return 'http://edufront.lagounews.com'
  }
}

// 封装函数，用于跳转回登录页面
function redirectLogin () {
  router.push({
    name: 'login',
    query: {
      // router.currentRoute 用于获取当前路由对应的路由信息对象
      redirect: router.currentRoute.fullPath
    }
  })
}

// 设置请求拦截器
request.interceptors.request.use(function (config) {
  // 根据请求的URL判断基地址，设置给config.baseURL
  config.baseURL = getBaseURL(config.url)

  // token 处理
  const { user } = store.state
  if (user && user.access_token) {
    config.headers.Authorization = user.access_token
  }

  return config
})

// 声明一个变量，存储 Token 的刷新状态
let isRefreshing = false

// 声明一个数组，存储因为等待token刷新而挂起的请求
let failedRequests = []

// 设置响应拦截器
request.interceptors.response.use(function (response) {
  // 状态码问 2xx 的都会进入这里
  return response
}, function (error) {
  // 超过 2xx 的会进入这里
  if (error.response) {
    // 请求发送成功，也收到了响应，但状态码超过 2xx
    // 1. 保存状态码
    const { status } = error.response
    // 2. 判断
    let errorMessage = ''
    if (status === 400) {
      errorMessage = '请求参数错误'
    } else if (status === 401) {
      // token 无效
      // 1. 检测：如果 store 中不存在 user,跳转登录页面
      if (!store.state.user) {
        redirectLogin()
        // 阻止后续操作，向下抛出错误对象
        return Promise.reject(error)
      }

      // 2. 根据 refresh_token 请求新的 access_token
      // 先判断是否有已发送的刷新请求
      // 如果有，则挂起
      if (isRefreshing) {
        // 将发送请求保存在函数中，存储到 failedRequests 中等待执行
        return failedRequests.push(() => {
          request(error.config)
        })
      }
      // 如果没有，则发送请求
      isRefreshing = true
      return request({
        method: 'POST',
        url: '/front/user/refresh_token',
        data: stringify({
          refresh_token: store.state.user.refresh_token
        })
      }).then(res => {
        // 检测： 是否成功请求到新的 access_token
        // 1. 若未成功请求到，则跳转到登录页面
        if (res.data.state !== 1) {
          // 清除已经无效的用户信息
          store.commit('setUser', null)
          // 跳转回登录页面
          redirectLogin()
          // 阻止后续操作，向下抛出错误对象
          return Promise.reject(error)
        }
        // 2. 若成功请求到，将新的 access_token 更新到容器和本地存储中
        store.commit('setUser', res.data.content)
        // 将 failedRequests 中的请求重新发送
        failedRequests.forEach(callback => callback())
        failedRequests = []
        // 这时，再对之前报401的接口重新请求
        return request(error.config)
      }).catch(() => {
        // 用于·处理 HTTP 报错的情况
        store.commit('setUser', null)
        redirectLogin()
        return Promise.reject(error)
      }).finally(() => {
        // 请求完毕，无论是否成功，设置isRefreshing为 false
        isRefreshing = false
      })
    } else if (status === 403) {
      errorMessage = '没有权限，请联系管理员'
    } else if (status === 404) {
      errorMessage = '请求资源不存在'
    } else if (status === 500) {
      errorMessage = '服务端错误，请联系管理员'
    }
    Message.error(errorMessage)
  } else if (error.request) {
    // 请求发送成功，但没有接收到响应
    Message.error('请求超时，请重试')
  } else {
    // 在设置请求时发生了一些未知型错误
    Message.error(`请求失败${error.message}`)
  }

  // 将请求失败的对象继续抛出，传递给接收响应的处理函数
  return Promise.reject(error)
})

export default request
