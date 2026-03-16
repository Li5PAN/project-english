/**
 * 学生首页服务
 */
import request from '@/utils/request'

/**
 * 获取学生学习概览数据
 * @returns {Promise<Object>} - 概览数据
 * @property {number} data.todayWordsLearned - 今日已学单词数量
 * @property {number} data.totalWrongQuestions - 总错题数
 * @property {number} data.classRank - 班级排名
 * @property {number} data.pendingTasks - 待完成任务数
 * @property {number} data.todayStudyMinutes - 今日学习时长(分钟)
 * @property {number} data.todayTasksCompleted - 今日完成任务数
 */
async function getStudentOverview() {
  return request({
    url: '/student/overview',
    method: 'get'
  })
}

/**
 * 学习打卡
 * @returns {Promise<Object>} - 打卡结果
 * @property {boolean} data.clockedIn - 今日是否已打卡
 * @property {string|null} data.clockInDate - 打卡时间
 * @property {number} data.consecutiveDays - 连续打卡天数
 */
async function clockIn() {
  return request({
    url: '/student/clockIn',
    method: 'post'
  })
}

/**
 * 获取打卡状态（查询今日是否已打卡及连续天数）
 * @returns {Promise<Object>} - 打卡状态
 */
async function getClockInStatus() {
  return request({
    url: '/student/clockIn',
    method: 'get'
  })
}

/**
 * 获取近7天任务完成情况
 * @returns {Promise<Object>} - 每日完成数量
 * @property {Array} data - [{date, completedCount}]
 */
async function getWeeklyQuestions() {
  return request({
    url: '/student/weekly/questions',
    method: 'get'
  })
}

/**
 * 获取近7天单词学习趋势
 * @returns {Promise<Object>} - 每日学习数量
 * @property {Array} data - [{date, masteredCount}]
 */
async function getWeeklyWordsStudied() {
  return request({
    url: '/student/weekly/words/studied',
    method: 'get'
  })
}

export default {
  getStudentOverview,
  clockIn,
  getClockInStatus,
  getWeeklyQuestions,
  getWeeklyWordsStudied
}
