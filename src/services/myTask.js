/**
 * 学生任务服务 - 获取我的任务列表
 */
import request from '@/utils/request'

/**
 * 获取我的任务列表
 * @param {Object} params - 查询参数
 * @param {boolean} params.completed - 是否已完成，false-未完成，true-已完成
 * @returns {Promise<Object>} - 任务列表数据
 * @property {Array} data - 任务数组
 * @property {number} data[].taskId - 任务ID
 * @property {string} data[].taskName - 任务名称
 * @property {string} data[].taskType - 任务类型
 * @property {number} data[].questionCount - 题目数量
 * @property {string} data[].startTime - 开始时间
 * @property {string} data[].endTime - 结束时间
 * @property {string} data[].className - 班级名称
 * @property {string} data[].classLevel - 班级等级
 * @property {string} data[].teacherName - 教师名称
 * @property {string} data[].taskStatus - 任务状态：0-未开始，1-进行中，2-已完成
 */
async function getMyTasks(params) {
  return request({
    url: '/student/tasks',
    method: 'get',
    params
  })
}

/**
 * 获取任务题目列表
 * @param {number} taskId - 任务ID
 * @returns {Promise<Object>} - 任务详情和题目数据
 * @property {Object} data - 任务详情
 * @property {number} data.taskId - 任务ID
 * @property {string} data.taskName - 任务名称
 * @property {string} data.taskType - 任务类型
 * @property {number} data.totalQuestions - 题目总数
 * @property {string} data.className - 班级名称
 * @property {string} data.teacherName - 教师名称
 * @property {string} data.taskStatus - 任务状态
 * @property {string} data.taskStatusText - 任务状态文本
 * @property {boolean} data.canSubmit - 是否可以提交
 * @property {Array} data.questions - 题目数组
 */
async function getTaskQuestions(taskId) {
  return request({
    url: '/student/task/questions',
    method: 'get',
    params: { taskId }
  })
}

/**
 * 获取任务详情
 * @param {number} taskId - 任务ID
 * @returns {Promise<Object>} - 任务详情数据
 * @property {Object} data - 任务详情
 * @property {number} data.taskId - 任务ID
 * @property {string} data.taskName - 任务名称
 * @property {string} data.taskType - 任务类型
 * @property {number} data.totalQuestions - 题目总数
 * @property {string} data.className - 班级名称
 * @property {string} data.teacherName - 教师名称
 * @property {string} data.taskStatus - 任务状态
 * @property {string} data.taskStatusText - 任务状态文本
 * @property {boolean} data.canSubmit - 是否可以提交
 * @property {string} data.submitTime - 提交时间
 * @property {number} data.score - 得分
 * @property {boolean} data.isPassed - 是否通过
 * @property {Array} data.questions - 题目数组
 */
async function getTaskDetail(taskId) {
  return request({
    url: '/student/task/detail',
    method: 'get',
    params: { taskId }
  })
}

/**
 * 提交答题
 * @param {Object} params - 提交参数
 * @param {number} params.taskId - 任务ID
 * @param {Array} params.answers - 答题数据列表
 * @param {number} params.answers[].questionId - 题目ID
 * @param {string} params.answers[].answer - 用户答案
 * @param {number} params.timeUsed - 用时秒数
 * @returns {Promise<Object>} - 提交结果
 * @property {boolean} success - 是否成功
 * @property {number} score - 得分
 * @property {number} totalQuestions - 题目总数
 * @property {number} correctCount - 答对题数
 * @property {number} wrongCount - 答错题数
 */
async function submitTaskAnswers(params) {
  return request({
    url: '/student/task/submit',
    method: 'post',
    data: params
  })
}

export default {
  getMyTasks,
  getTaskQuestions,
  getTaskDetail,
  submitTaskAnswers
}
