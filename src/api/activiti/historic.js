import request from '@/utils/request'
import { HTTP_METHOD } from '@/utils/const/http/method'

const baseUrl = '/auth/activiti/historic/'

/**
 * 查询数据
 *
 * @param processInstanceId {string} 流程实例ID
 * @return List<Historic>
 */
export function selectHistoric (processInstanceId) {
  return request({
    url: `${baseUrl}processInstanceId/${processInstanceId}`,
    method: HTTP_METHOD.GET
  })
}

/**
 * 根据业务id查询流程实例
 *
 * @param businessKey {string} 业务id
 * @return Task
 */
export function selectTask (businessKey) {
  return request({
    url: `${baseUrl}task`,
    method: HTTP_METHOD.GET,
    params: {
      businessKey
    }
  })
}
