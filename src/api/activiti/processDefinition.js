import request from '@/utils/request'
import { HTTP_METHOD } from '@/utils/const/http/method'

const baseUrl = '/auth/activiti/process/definition/'
/**
 * 读取流程表单
 *
 * @param processDefinitionId 流程id
 * @return JSONObject
 */
export function readStartForm (processDefinitionId) {
  return request({
    url: `${baseUrl}start/form/${processDefinitionId}`,
    method: HTTP_METHOD.GET
  })
}

/**
 * 启动流程
 *
 * @param data {object} 流程数据
 * @return JSONObject
 */
export function startProcessInstance (data) {
  return request({
    url: `${baseUrl}process/instance`,
    method: HTTP_METHOD.POST,
    data
  })
}
