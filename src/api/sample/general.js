import request from '@/utils/request'
import { HTTP_METHOD } from '@/utils/const/http/method'

const baseUrl = '/auth/sample/general/'

/**
 * 查询数据
 *
 * @param params 查询参数
 * @return Page<SampleGeneral>
 */
export function select (params) {
  return request({
    url: baseUrl,
    method: HTTP_METHOD.GET,
    params
  })
}

/**
 * 详情
 *
 * @param id id
 * @return SampleGeneral
 */
export function get (id) {
  return request({
    url: baseUrl + id,
    method: HTTP_METHOD.GET
  })
}

/**
 * 新增
 *
 * @return SampleGeneral
 */
export function add () {
  return request({
    url: `${baseUrl}/add`,
    method: HTTP_METHOD.GET
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
    url: baseUrl + ids,
    method: HTTP_METHOD.DELETE
  })
}

/**
 * 保存
 *
 * @param params 查询条件
 * @return SampleGeneral
 */
export function save (params) {
  return request({
    url: baseUrl,
    method: HTTP_METHOD.POST,
    data: params
  })
}