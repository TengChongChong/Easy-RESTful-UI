import request from '@/utils/request'
import { HTTP_METHOD } from '@/utils/const/http/method'

const baseUrl = '/auth/activiti/history/task-instance/'

/**
 * 我发起的
 *
 * @param params 查询条件
 * @return Page<HistoryTaskInstance>
 */
export function selectMy (params) {
  return request({
    url: `${baseUrl}my`,
    method: HTTP_METHOD.GET,
    params
  })
}

/**
 * 我办理的
 *
 * @param params 查询条件
 * @return Page<HistoryTaskInstance>
 */
export function selectParticipate (params) {
  return request({
    url: `${baseUrl}participate`,
    method: HTTP_METHOD.GET,
    params
  })
}

/**
 * 所有任务
 *
 * @param params 查询条件
 * @return Page<HistoryTaskInstance>
 */
export function selectAll (params) {
  return request({
    url: `${baseUrl}all`,
    method: HTTP_METHOD.GET,
    params
  })
}
