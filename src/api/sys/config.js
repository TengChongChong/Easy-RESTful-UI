import request from '@/utils/request'
import { HTTP_METHOD } from '@/utils/const/http/method'

const baseUrl = '/auth/sys/config/'

/**
 * 查询数据
 *
 * @param params 查询参数
 * @return Page<SysCode>
 */
export function select (params) {
  return request({
    url: baseUrl,
    method: HTTP_METHOD.GET,
    params
  })
}

/**
 * 删除
 *
 * @param ids {string} ids
 * @return true/false
 */
export function remove (ids) {
  return request({
    url: `${baseUrl}${ids}`,
    method: HTTP_METHOD.DELETE
  })
}

/**
 * 保存
 *
 * @param params 查询条件
 * @return SysCode
 */
export function save (params) {
  return request({
    url: baseUrl,
    method: HTTP_METHOD.POST,
    data: params
  })
}

/**
 * 详情
 *
 * @param id id
 * @return SysCode
 */
export function get (id) {
  return request({
    url: `${baseUrl}${id}`,
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
    url: `/sys/config/key/${key}`,
    method: HTTP_METHOD.GET
  })
}
export function refreshCache (id) {
  return request({
    url: `${baseUrl}refresh/cache`,
    method: HTTP_METHOD.POST
  })
}
