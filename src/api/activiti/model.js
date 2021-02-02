import request from '@/utils/request'
import { HTTP_METHOD } from '@/utils/const/http/method'

const baseUrl = '/auth/activiti/model/'

export function select (params) {
  return request({
    url: baseUrl,
    method: HTTP_METHOD.GET,
    params
  })
}

export function remove (ids) {
  return request({
    url: `${baseUrl}${ids}`,
    method: HTTP_METHOD.DELETE
  })
}

export function save (params) {
  return request({
    url: baseUrl,
    method: HTTP_METHOD.POST,
    data: params
  })
}

export function get (id) {
  return request({
    url: `${baseUrl}${id}`,
    method: HTTP_METHOD.GET
  })
}
/**
 * 部署流程
 *
 * @param id 模型id
 * @return true/false
 */
export function deploymentProcess (id) {
  return request({
    url: `${baseUrl}deployment/process/${id}`,
    method: HTTP_METHOD.POST
  })
}

/**
 * 导出模型
 *
 * @param id 模型id
 */
export function exportModel (id) {
  return request({
    url: `${baseUrl}export/${id}`,
    method: HTTP_METHOD.GET
  })
}
/**
 * 根据模型标识查询流程定义ID
 *
 * @param key 模型标识
 * @return Tips 流程定义ID
 */
export function selectProcessDefinitionId (key) {
  return request({
    url: `${baseUrl}process/definition/id/${key}`,
    method: HTTP_METHOD.GET
  })
}
