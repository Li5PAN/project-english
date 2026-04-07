/**
 * 教师端 - 题目管理接口
 */
import request from '@/utils/request'

/**
 * 获取题目列表
 * @param {Object} params - 查询参数
 * @param {string} [params.beginDate] - 开始时间，格式：YYYY-MM-DD（可选）
 * @param {string} [params.endDate] - 结束时间，格式：YYYY-MM-DD（可选）
 * @param {string} [params.questionType] - 题目类型：1-选择题，2-填空题，3-单词拼写（可选）
 * @param {string} [params.classLevel] - 班级等级：A/B/C/D（可选）
 * @returns {Promise<Object>} - 返回题目列表数据
 * @property {number} data.total - 总记录数
 * @property {Array} data.rows - 题目列表
 * @property {number} data.rows[].questionId - 题目ID
 * @property {string} data.rows[].questionType - 题目类型：1-选择题，2-填空题，3-单词拼写
 * @property {number} data.rows[].wrongCount - 错误次数
 * @property {string} data.rows[].taskName - 任务名称
 * @property {number} data.rows[].taskId - 任务ID
 * @property {string} data.rows[].classLevel - 班级等级
 * @property {number} data.rows[].classId - 班级ID
 * @property {string} data.rows[].createTime - 创建时间
 */
export async function getQuestionList(params) {
  const res = await request({
    url: '/teacher/question/list',
    method: 'GET',
    params
  })

  return res
}

/**
 * 获取题目详情
 * @param {number} questionId - 题目ID
 * @returns {Promise<Object>} - 返回题目详情数据
 * @property {number} data.questionId - 题目ID
 * @property {string} data.questionContent - 题目内容
 * @property {string} data.questionType - 题目类型：1-选择题，2-填空题，3-单词拼写
 * @property {string} data.options - 题目选项（JSON格式字符串）
 * @property {string} data.correctAnswer - 正确答案
 * @property {string} data.taskName - 任务名称
 * @property {number} data.wrongCount - 错误次数
 * @property {string} data.createTime - 创建时间
 */
export async function getQuestionDetail(questionId) {
  const res = await request({
    url: '/teacher/question/detail',
    method: 'GET',
    params: { questionId }
  })

  return res
}

/**
 * 获取错题模板下载地址
 * @returns {string} - 返回模板下载的完整URL
 */
export function getQuestionTemplateUrl() {
  return request.defaults.baseURL + '/teacher/question/template'
}

/**
 * 导入错题
 * @param {FormData} formData - 包含文件的表单数据
 * @param {string} [formData.taskId] - 任务ID（可选）
 * @returns {Promise<Object>} - 返回导入结果
 */
export async function importQuestion(formData) {
  const res = await request({
    url: '/teacher/question/import',
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  return res
}

/**
 * 导出题目
 * @param {number} taskId - 任务ID（必需）
 * @returns {Blob} - 返回文件流
 */
export async function exportQuestion(taskId) {
  const res = await request({
    url: '/teacher/question/export',
    method: 'POST',
    params: { taskId },
    responseType: 'blob'
  })

  return res
}

/**
 * 批量删除题目
 * @param {number[]} questionIds - 题目ID数组
 * @returns {Promise<Object>} - 返回删除结果
 * @property {string} data.msg - 删除结果消息
 * @property {number} data.code - 状态码
 */
export async function batchDeleteQuestions(questionIds) {
  const res = await request({
    url: '/teacher/question/batch',
    method: 'DELETE',
    data: questionIds
  })

  return res
}