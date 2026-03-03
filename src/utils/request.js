import axios from 'axios'
import { message } from 'ant-design-vue'

// 创建 axios 实例
const request = axios.create({
  baseURL: import.meta.env.VITE_PROXY_DOMAIN_REAL || 'http://106.52.154.12:58080',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const res = response.data
    
    console.log('API 响应:', res)
    
    // 根据后端返回的状态码判断
    // 这里假设后端返回格式为 { code: xxx, data: xxx, message: xxx }
    if (res.code === 200 || res.code === '200' || res.code === 0 || res.code === '0') {
      return res
    } else {
      // 业务错误
      const errorMsg = res.message || res.msg || '请求失败'
      console.error('业务错误:', errorMsg, res)
      message.error(errorMsg)
      return Promise.reject(new Error(errorMsg))
    }
  },
  (error) => {
    console.error('响应错误:', error)
    
    // 处理 HTTP 错误状态码
    if (error.response) {
      const status = error.response.status
      
      switch (status) {
        case 401:
          message.error('未授权，请重新登录')
          // 清除本地存储
          localStorage.removeItem('token')
          localStorage.removeItem('userInfo')
          // 跳转到登录页
          window.location.href = '/#/login'
          break
        case 403:
          message.error('拒绝访问')
          break
        case 404:
          message.error('请求的资源不存在')
          break
        case 500:
          message.error('服务器内部错误')
          break
        case 502:
          message.error('网关错误')
          break
        case 503:
          message.error('服务不可用')
          break
        case 504:
          message.error('网关超时')
          break
        default:
          message.error(error.response.data?.message || '请求失败')
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      message.error('网络连接失败，请检查网络')
    } else {
      // 其他错误
      message.error(error.message || '请求失败')
    }
    
    return Promise.reject(error)
  }
)

export default request
