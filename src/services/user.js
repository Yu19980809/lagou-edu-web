import request from '@/utils/request'
import { stringify } from 'qs'

// 用户登录请求接口
export const login = data => {
  return request({
    method: 'POST',
    url: '/front/user/login',
    // axios 的请求参数默认为 application/json 格式
    // 而接口需要 x-www-form-urlencoded 格式
    // 所以需要通过 qs 模块对参数进行格式转换，否则会导致请求失败
    // data: {
    //   phone: this.form.phone,
    //   password: this.form.password
    // }
    data: stringify(data)
  })
}

// 用户基本信息请求接口
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/front/user/getInfo'
  })
}

// 分页查询用户信息
export const getUserPages = data => {
  return request({
    method: 'POST',
    url: '/boss/user/getUserPages',
    data
  })
}

// 封禁用户
export const forbidUser = userId => {
  return request({
    method: 'POST',
    url: '/boss/user/forbidUser',
    params: {
      userId
    }
  })
}
