/**
 * 学生端 - 学情统计接口
 */
import request from '@/utils/request'

/**
 * 获取学情统计数据
 * @returns {Promise<Object>} - 返回学情统计数据
 * @property {number} data.totalWordsSearched - 累计查词量
 * @property {number} data.tasksCompleted - 任务完成数
 * @property {number} data.wrongQuestions - 错题数
 * @property {number} data.masteredWords - 掌握单词量
 * @property {number} data.totalStudyMinutes - 学习总时长(分钟)
 */
export async function getStudentStats() {
  const res = await request({
    url: '/student/stats',
    method: 'GET'
  })

  return res
}

/**
 * 获取近七天任务完成情况
 * @returns {Promise<Array>} - 返回近七天任务完成数据
 * @property {string} date - 日期
 * @property {number} completedCount - 完成数量
 */
export async function getWeeklyTasks() {
  const res = await request({
    url: '/student/stats/weekly/tasks',
    method: 'GET'
  })

  return res
}
