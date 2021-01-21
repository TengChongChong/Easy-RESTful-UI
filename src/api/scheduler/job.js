import request from '@/utils/request'
import { HTTP_METHOD } from '@/utils/const/http/method'

const baseUrl = '/auth/scheduler/job/'

export function select (params) {
  return request({
    url: baseUrl,
    method: HTTP_METHOD.GET,
    params
  })
}

export function remove (ids) {
  return request({
    url: baseUrl + ids,
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

export function get (id) {
  return request({
    url: baseUrl + id,
    method: HTTP_METHOD.GET
  })
}

/**
 * 开启
 *
 * @param id 数据id
 * @return true/false
 */
export function start (id) {
  return request({
    url: `${baseUrl}start/${id}`,
    method: HTTP_METHOD.POST
  })
}

/**
 * 暂停
 *
 * @param id 数据id
 * @return true/false
 */
export function pause (id) {
  return request({
    url: `${baseUrl}pause/${id}`,
    method: HTTP_METHOD.POST
  })
}

/**
 * 全部开启
 *
 * @return true/false
 */
export function startAll () {
  return request({
    url: `${baseUrl}start/all`,
    method: HTTP_METHOD.POST
  })
}

/**
 * 全部暂停
 *
 * @return true/false
 */
export function pauseAll () {
  return request({
    url: `${baseUrl}pause/all`,
    method: HTTP_METHOD.POST
  })
}

/**
 * 立即执行指定任务
 *
 * @param id 数据id
 * @return true/false
 */
export function immediateExecution (id) {
  return request({
    url: `${baseUrl}immediate/execution/${id}`,
    method: HTTP_METHOD.POST
  })
}
