import request from '@/utils/request'

// 获取待审核班级列表
export const getAuditList = () => {
  return request({
    url: '/admin/class/audit-list',
    method: 'get'
  })
}

// 获取班级管理列表
export const getManageList = () => {
  return request({
    url: '/admin/class/manage-list',
    method: 'get'
  })
}

// 审核班级（通过/拒绝）
export const auditClass = (classId, isPass) => {
  return request({
    url: '/admin/class/audit',
    method: 'post',
    params: {
      classId,
      isPass
    }
  })
}

// 删除班级
export const deleteClass = (classId) => {
  return request({
    url: `/admin/class/${classId}`,
    method: 'delete'
  })
}
