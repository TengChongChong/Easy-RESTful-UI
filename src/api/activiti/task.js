import request from '@/utils/request'
import { HTTP_METHOD } from '@/utils/const/http/method'

const baseUrl = '/auth/activiti/task/'

/**
 * 查询数据
 *
 * @param status 任务状态
 * @param params 查询条件
 * @return Page<Task>
 */
export function select (status, params) {
  return request({
    url: `${baseUrl}status/${status}`,
    method: HTTP_METHOD.GET,
    params
  })
}

/**
 * 签收任务
 *
 * @param taskId 任务id
 * @return Tips
 */
export function claimTask (taskId) {
  return request({
    url: `${baseUrl}claim/task/${taskId}`,
    method: HTTP_METHOD.POST
  })
}

/**
 * 获取任务信息
 *
 * @param taskId 任务id
 * @return JSONObject
 */
export function get (taskId) {
  return request({
    url: `${baseUrl}${taskId}`,
    method: HTTP_METHOD.GET
  })
}

/**
 * 流转任务
 *
 * @param taskId  任务Id
 * @param data 表单数据
 * @return true/false
 */
export function completeTask (taskId, data) {
  return request({
    url: `${baseUrl}complete/task/${taskId}`,
    method: HTTP_METHOD.POST,
    data
  })
}

/**
 * 撤销申请
 *
 * @param processInstanceId 流程实例ID
 * @param deleteReason      撤销原因(可为空)
 * @return true/false
 */
export function revoke (processInstanceId, deleteReason) {
  return request({
    url: `${baseUrl}revoke/${processInstanceId}`,
    method: HTTP_METHOD.POST,
    data: {
      deleteReason
    }
  })
}
