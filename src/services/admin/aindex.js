/**
 * 管理端 - 首页数据接口
 */
import request from '@/utils/request'

/**
 * 获取首页统计数据
 * @returns {Promise<Object>} - 返回统计数据
 * @property {number} data.totalStudents - 总学生人数
 * @property {number} data.totalClasses - 总班级数
 * @property {number} data.totalTeachers - 总教师人数
 * @property {number} data.pendingClasses - 待审核班级数量
 */
export async function getDashboardData() {
  const res = await request({
    url: '/admin/dashboard',
    method: 'GET'
  })

  return res
}
