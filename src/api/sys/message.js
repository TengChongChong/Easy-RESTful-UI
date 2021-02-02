import request from '@/utils/request'
import { HTTP_METHOD } from '@/utils/const/http/method'

const baseUrl = '/auth/sys/message/'

export function select (params) {
  return request({
    url: baseUrl,
    method: HTTP_METHOD.GET,
    params
  })
}
/**
 * 收信列表
 *
 * @param params 查询条件
 */
export function selectReceive (params) {
  return request({
    url: `${baseUrl}receive`,
    method: HTTP_METHOD.GET,
    params
  })
}

export function get (id) {
  return request({
    url: `${baseUrl}${id}`,
    method: HTTP_METHOD.GET
  })
}

/**
 * 阅读消息
 *
 * @param id        消息 id
 * @param messageId 收信id
 */
export function info (id, messageId) {
  return request({
    url: `${baseUrl}info`,
    method: HTTP_METHOD.GET,
    params: {
      id, messageId
    }
  })
}

export function add () {
  return request({
    url: `${baseUrl}add`,
    method: HTTP_METHOD.GET
  })
}

export function remove (ids) {
  return request({
    url: `${baseUrl}${ids}`,
    method: HTTP_METHOD.DELETE
  })
}

export function save (params) {
  return request({
    url: baseUrl,
    method: HTTP_METHOD.POST,
    data: params
  })
}

/**
 * 发送
 *
 * @param ids ids
 */
export function send (ids) {
  return request({
    url: `${baseUrl}send`,
    method: HTTP_METHOD.POST,
    data: {
      ids
    }
  })
}
/**
 * 获取当前登录用户查询未读消息数量
 */
export function selectUnreadCount () {
  return request({
    url: `${baseUrl}unread/count`,
    method: HTTP_METHOD.GET
  })
}
