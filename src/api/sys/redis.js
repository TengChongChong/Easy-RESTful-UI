import request from '@/utils/request'
import { HTTP_METHOD } from '@/utils/const/http/method'

const baseUrl = '/auth/sys/redis/'

/**
 * 删除
 *
 * @param key key
 */
export function remove (key) {
  return request({
    url: baseUrl + key,
    method: HTTP_METHOD.DELETE
  })
}

/**
 * 保存
 *
 * @param params 表单内容
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
 * @param key key
 */
export function get (key) {
  return request({
    url: baseUrl + 'key/' + key,
    method: HTTP_METHOD.GET
  })
}

/**
 * 根据前缀查询redis列表
 *
 * @param prefix 前缀
 * @return Set<String>
 */
export function selectByPrefix (prefix) {
  return request({
    url: `${baseUrl}prefix/${prefix}`,
    method: HTTP_METHOD.GET
  })
}
