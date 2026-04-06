/**
 * 教师端 - 教师首页数据概览接口
 */
import request from '@/utils/request'

/**
 * 获取教师首页数据概览
 * @returns {Promise<Object>} - 返回教师首页统计数据
 * @property {number} data.totalStudents - 学生总人数（该老师下所有班级的学生人数总计）
 * @property {number} data.totalClasses - 班级总数
 * @property {number} data.pendingApplications - 待审核状态的学生申请数量
 * @property {number} data.pendingTasks - 待完成任务数（老师管理的所有班级下达的任务数量）
 */
export async function getTeacherDashboard() {
  const res = await request({
    url: '/teacher/dashboard',
    method: 'GET'
  })

  return res
}

/**
 * 获取班级等级分布数据
 * @returns {Promise<Array>} - 返回班级等级分布数据
 * @property {string} classLevel - 班级等级(A/B/C/D)
 * @property {number} classCount - 班级数量
 * @property {number} totalClasses - 班级总数
 * @property {number} distributionRate - 班级等级分布率
 */
export async function getLevelDistribution() {
  const res = await request({
    url: '/teacher/dashboard/level-distribution',
    method: 'GET'
  })

  return res
}
