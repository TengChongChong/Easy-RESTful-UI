import request from '@/utils/request'
import { HTTP_METHOD } from '@/utils/const/http/method'

const baseUrl = '/auth/activiti/process/'

export function select (params) {
  return request({
    url: baseUrl,
    method: HTTP_METHOD.GET,
    params
  })
}

export function remove (ids) {
  return request({
    url: baseUrl + ids,
    method: HTTP_METHOD.DELETE
  })
}

/**
 * 流程转模型
 *
 * @param data {object} 表单数据
 * @return true/false
 */
export function convertToModel (data) {
  return request({
    url: `${baseUrl}convert/to/model`,
    method: HTTP_METHOD.POST,
    data
  })
}

/**
 * 添加流程
 *
 * @param path 流程模型文件路径
 * @return true/false
 */
export function add (path) {
  return request({
    url: baseUrl,
    method: HTTP_METHOD.POST,
    data: { path }
  })
}

/**
 * 挂起流程
 *
 * @param processDefinitionId     流程id
 * @param suspendProcessInstances 如果为true，将同时挂起此流程正在进行的任务
 * @return true/false
 */
export function suspend (processDefinitionId, suspendProcessInstances) {
  return request({
    url: `${baseUrl}suspend/${processDefinitionId}/${suspendProcessInstances}`,
    method: HTTP_METHOD.POST
  })
}

/**
 * 激活流程
 *
 * @param processDefinitionId     流程id
 * @param suspendProcessInstances 如果为true，将同时激活此流程正在进行的任务
 * @return true/false
 */
export function activation (processDefinitionId, suspendProcessInstances) {
  return request({
    url: `${baseUrl}activation/${processDefinitionId}/${suspendProcessInstances}`,
    method: HTTP_METHOD.POST
  })
}

/**
 * 查询流程数据用于放到select的option中
 *
 * @return List<Select>
 */
export function selectProcessForSelect () {
  return request({
    url: `${baseUrl}process/for/select`,
    method: HTTP_METHOD.GET
  })
}
