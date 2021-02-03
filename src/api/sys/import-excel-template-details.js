import request from '@/utils/request'
import { HTTP_METHOD } from '@/utils/const/http/method'

// 导入规则
const baseUrl = '/auth/sys/import/excel/template/details/'

/**
 * 获取已配置字段
 *
 * @param templateId 导入模板id
 * @return List<SysImportExcelTemplateDetails>
 */
export function select (templateId) {
  return request({
    url: `${baseUrl}details/${templateId}`,
    method: HTTP_METHOD.GET
  })
}

/**
 * 根据模板代码获取表格表头
 *
 * @param templateId 模板id
 * @return List<Column>
 */
export function selectTableHeadByTemplateCode (templateId) {
  return request({
    url: `${baseUrl}table/head/${templateId}`,
    method: HTTP_METHOD.GET
  })
}

/**
 * 保存
 *
 * @param templateId 导入模板id
 * @param data       表单内容
 * @return true/false
 */
export function save (templateId, data) {
  return request({
    url: `${baseUrl}${templateId}`,
    method: HTTP_METHOD.POST,
    data
  })
}
