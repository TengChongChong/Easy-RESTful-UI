import request from '@/utils/request'
import { HTTP_METHOD } from '@/utils/const/http/method'

// 导入临时表
const baseUrl = '/auth/sys/import/excel/temporary/'

/**
 * 查询数据
 *
 * @param params {object} 查询参数
 * @return Page<SysImportExcelTemplate>
 */
export function selectTemporaryData (params) {
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
 * 清空指定导入代码中数据
 *
 * @param templateId 模板id
 */
export function cleanMyImport (templateId) {
  return request({
    url: `${baseUrl}clean/my/import/${templateId}`,
    method: HTTP_METHOD.DELETE
  })
}
