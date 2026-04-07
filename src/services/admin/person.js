import request from '@/utils/request'

// 获取人员列表
export const getUserList = (roleType) => {
  return request({
    url: '/admin/user/list',
    method: 'get',
    params: {
      roleType: roleType || undefined
    }
  })
}

// 获取人员详情
export const getUserDetail = (targetUserId) => {
  return request({
    url: '/admin/user/detail',
    method: 'get',
    params: {
      targetUserId
    }
  })
}

// 删除用户
export const deleteUser = (targetUserId) => {
  return request({
    url: `/admin/user/${targetUserId}`,
    method: 'delete'
  })
}
