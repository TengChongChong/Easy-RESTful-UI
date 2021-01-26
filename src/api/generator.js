import request from '@/utils/request'
import { HTTP_METHOD } from '@/utils/const/http/method'

const baseUrl = '/auth/generator/'
/**
 * 获取表名
 *
 * @return List<Select>
 */
export function selectTable () {
  return request({
    url: `${baseUrl}table`,
    method: HTTP_METHOD.GET
  })
}
/**
 * 根据表名获取字段列表
 *
 * @param tableName      表名
 * @return TableInfo
 */
export function selectFields (tableName) {
  return request({
    url: `${baseUrl}fields`,
    method: HTTP_METHOD.GET,
    params: { tableName }
  })
}

/**
 * 获取模块列表
 *
 * @return List<Select>
 */
export function selectModules () {
  return request({
    url: `${baseUrl}modules`,
    method: HTTP_METHOD.GET
  })
}

/**
 * 生成代码
 *
 * @param params 参数
 * @return true/false
 */
export function generate (params) {
  return request({
    url: baseUrl,
    method: HTTP_METHOD.POST,
    data: params
  })
}
