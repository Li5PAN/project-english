import request from '@/utils/request'

/**
 * 用户登录（只需账号密码，code/uuid 可选不传）
 */
export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data: {
      username: data.username,
      password: data.password
    }
  })
}

/**
 * 获取用户信息（含角色）
 */
export function getUserInfo() {
  return request({
    url: '/getInfo',
    method: 'get'
  })
}

/**
 * 退出登录
 */
export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}
