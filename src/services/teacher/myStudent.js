/**
 * 教师端 - 我的学生相关接口
 */
import request from '@/utils/request'

/**
 * 获取申请列表
 * @param {Object} params - 查询参数
 * @param {string} params.applicationType - 申请类型(1入班 2换班 3退班)
 * @returns {Promise<Object>} - 返回申请列表数据
 * @property {number} total - 总数
 * @property {Array} rows - 申请列表
 * @property {number} code - 状态码
 * @property {string} msg - 消息
 */
export async function getApplicationList(params) {
  const res = await request({
    url: '/teacher/application/list',
    method: 'GET',
    params
  })

  return res
}
