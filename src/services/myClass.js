/**
 * 学生端 - 我的班级页面接口
 */

import request from '../utils/request'

/**
 * 获取我的班级信息
 * @returns {Promise<Object>} - 返回班级信息
 */
export async function getMyClassInfo() {
  const res = await request({
    url: '/student/class/my',
    method: 'GET'
  })

  return res
}

/**
 * 获取班级排行榜
 * @returns {Promise<Array>} - 返回排行榜数据
 */
export async function getClassRanking() {
  const res = await request({
    url: '/student/class/ranking',
    method: 'GET'
  })

  return res
}

/**
 * 退出班级
 * @returns {Promise<Object>} - 返回退出结果
 */
export async function quitClass() {
  const res = await request({
    url: '/student/class/quit',
    method: 'POST'
  })

  return res
}
