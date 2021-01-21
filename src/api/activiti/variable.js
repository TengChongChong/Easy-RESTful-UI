import request from '@/utils/request'
import { HTTP_METHOD } from '@/utils/const/http/method'

const baseUrl = '/auth/activiti/variable/'

/**
 * 查询流程相关变量
 *
 * @param processInstanceId {string} 流程实例ID
 * @return List<Historic>
 */
export function selectVariable (processInstanceId) {
  return request({
    url: `${baseUrl}processInstanceId/${processInstanceId}`,
    method: HTTP_METHOD.GET
  })
}
