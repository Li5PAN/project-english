import request from '@/utils/request'

/**
 * 获取单词列表
 * @param {Object} params - 查询参数
 * @param {number} params.pageNum - 页码
 * @param {number} params.pageSize - 每页数量
 * @param {string} params.level - 单词等级（可选）
 * @param {string} params.category - 单词分类（可选）
 */
export function getWordList(params) {
  return request({
    url: '/business/word_library/list',
    method: 'get',
    params
  })
}

/**
 * 获取单词详情
 * @param {number} id - 单词ID
 */
export function getWordDetail(id) {
  return request({
    url: `/business/word_library/${id}`,
    method: 'get'
  })
}
