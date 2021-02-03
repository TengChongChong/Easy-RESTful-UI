import request from '@/utils/request'
import { HTTP_METHOD } from '@/utils/const/http/method'

// 导入模板
const baseUrl = '/auth/sys/import/excel/template/'

/**
 * 查询数据
 *
 * @param params {object} 查询参数
 * @return Page<SysImportExcelTemplate>
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
 * @param data {object} 表单数据
 * @return SysImportExcelTemplate
 */
export function save (data) {
  return request({
    url: baseUrl,
    method: HTTP_METHOD.POST,
    data
  })
}

/**
 * 详情
 *
 * @param id {string} id
 * @return SysImportExcelTemplate
 */
export function get (id) {
  return request({
    url: `${baseUrl}${id}`,
    method: HTTP_METHOD.GET
  })
}

/**
 * 下载导入模板
 *
 * @param importCode {string} 模板代码
 */
export function downloadTemplate (importCode) {
  return request({
    url: `${baseUrl}template/${importCode}`,
    method: HTTP_METHOD.GET
  })
}
