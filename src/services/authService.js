/**
 * 认证服务 - 登录/登出/用户信息
 */
import request from '@/utils/request'

/**
 * 用户登录
 * @param {Object} params - 登录参数
 * @param {string} params.username - 用户名
 * @param {string} params.password - 密码
 * @returns {Promise<Object>} - 登录结果
 */
async function login(params) {
  const res = await request({
    url: '/login',
    method: 'post',
    data: {
      username: params.username,
      password: params.password
    }
  })

  // 登录成功后存储 token
  if (res && res.token) {
    localStorage.setItem('token', res.token)
  }

  return res
}

/**
 * 获取当前用户信息
 * @returns {Promise<Object>} - 用户信息
 */
async function getUserInfo() {
  const res = await request({
    url: '/getInfo',
    method: 'get'
  })

  // 缓存用户信息
  if (res && res.user) {
    localStorage.setItem('userInfo', JSON.stringify(res.user))
  }

  return res
}

/**
 * 退出登录
 * @returns {Promise<Object>} - 登出结果
 */
async function logout() {
  const res = await request({
    url: '/logout',
    method: 'post'
  })

  // 清除本地缓存
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')

  return res
}

export default {
  login,
  getUserInfo,
  logout
}
