import request from '@/utils/request'
import { HTTP_METHOD } from '@/utils/const/http/method'

const baseUrl = '/auth/sys/config/'
const api = {
  refreshCache: baseUrl + 'refresh/cache'
}

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
 * 根据key获取配置
 *
 * @param key key
 */
export function getByKey (key) {
  return request({
    url: baseUrl + 'key/' + key,
    method: HTTP_METHOD.GET
  })
}
export function refreshCache (id) {
  return request({
    url: api.refreshCache,
    method: HTTP_METHOD.POST
  })
}
