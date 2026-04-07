/**
 * 教师端 - 任务管理接口
 */
import request from '@/utils/request'

/**
 * 获取任务列表
 * @param {Object} params - 查询参数
 * @param {string} [params.classLevel] - 班级等级(A/B/C/D)
 * @param {number} [params.pageNum=1] - 页码，默认1
 * @param {number} [params.pageSize=10] - 每页条数，默认10
 * @returns {Promise<Object>} - 返回任务列表数据
 * @property {number} data.total - 总记录数
 * @property {Array} data.rows - 任务列表
 * @property {number} data.rows[].taskId - 任务ID
 * @property {string} data.rows[].taskName - 任务名称
 * @property {number} data.rows[].classId - 班级ID
 * @property {string} data.rows[].className - 班级名称
 * @property {string} data.rows[].classLevel - 班级等级
 * @property {number} data.rows[].questionCount - 题目数量
 * @property {string} data.rows[].startTime - 开始时间
 * @property {string} data.rows[].endTime - 截止时间
 * @property {number} data.rows[].completedCount - 完成人数
 * @property {number} data.rows[].totalStudents - 班级总人数
 * @property {string} data.rows[].taskStatus - 任务状态：0-未开始，1-进行中，2-已结束
 */
export async function getTaskList(params) {
  const res = await request({
    url: '/teacher/task/list',
    method: 'GET',
    params
  })

  return res
}

/**
 * 获取任务详情
 * @param {number} taskId - 任务ID
 * @returns {Promise<Object>} - 返回任务详情数据
 * @property {number} data.taskId - 任务ID
 * @property {string} data.taskName - 任务名称
 * @property {number} data.classId - 班级ID
 * @property {string} data.className - 班级名称
 * @property {string} data.classLevel - 班级等级
 * @property {number} data.questionCount - 题目数量
 * @property {string} data.startTime - 开始时间
 * @property {string} data.endTime - 截止时间
 * @property {number} data.completedCount - 完成人数
 * @property {number} data.totalStudents - 班级总人数
 * @property {string} data.taskStatus - 任务状态
 * @property {Array} data.questions - 题目列表
 */
export async function getTaskDetail(taskId) {
  const res = await request({
    url: '/teacher/task/detail',
    method: 'GET',
    params: { taskId }
  })

  return res
}

/**
 * 发送任务督促
 * @param {Object} params - 督促参数
 * @param {number} params.taskId - 任务ID
 * @param {number} [params.reminderType=0] - 督促类型：0-手动督促，1-自动督促（每天下午17:00自动督促）
 * @returns {Promise<Object>} - 返回督促结果
 */
export async function sendTaskReminder(params) {
  const res = await request({
    url: '/teacher/task/reminder',
    method: 'POST',
    params
  })

  return res
}
