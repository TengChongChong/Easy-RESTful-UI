import request from '@/utils/request'
import { HTTP_METHOD } from '@/utils/const/http/method'

// 导入数据
const baseUrl = '/auth/sys/import/excel/data/'

/**
 * 获取导入模板信息
 *
 * @param importCode 模板代码
 * @return template: {}, hasLast: boolean
 */
export function select (importCode) {
  return request({
    url: `${baseUrl}${importCode}`,
    method: HTTP_METHOD.GET
  })
}

/**
 * 验证并解析文件
 *
 * @param templateId 模板id
 * @param path       {string} 文件路径
 * @return true/false
 */
export function analysis (templateId, path) {
  return request({
    url: `${baseUrl}analysis/${templateId}`,
    method: HTTP_METHOD.POST,
    data: { path }
  })
}

/**
 * 查询指定导入汇总信息
 *
 * @param templateId 模板id
 * @return SysImportSummary
 */
export function selectSummary (templateId) {
  return request({
    url: `${baseUrl}summary/${templateId}`,
    method: HTTP_METHOD.GET
  })
}

/**
 * 插入数据
 *
 * @param templateId 模板id
 */
export function insertData (templateId) {
  return request({
    url: `${baseUrl}data/${templateId}`,
    method: HTTP_METHOD.POST
  })
}

/**
 * 导出验证失败数据
 *
 * @param templateId 模板id
 * @return 文件下载id
 */
export function exportVerificationFailData (templateId) {
  return request({
    url: `${baseUrl}export/verification/fail/data/${templateId}`,
    method: HTTP_METHOD.GET
  })
}
