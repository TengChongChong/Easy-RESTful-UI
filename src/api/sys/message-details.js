import request from '@/utils/request'
import { HTTP_METHOD } from '@/utils/const/http/method'

const baseUrl = '/auth/sys/message/details/'

/**
 * 设置消息标星/取消标星
 *
 * @param id   接受消息id
 * @param type true/false 是否标星
 * @return true/false
 */
export function setStar (id, type) {
  return request({
    url: `${baseUrl}star/${id}/${type}`,
    method: HTTP_METHOD.POST
  })
}

/**
 * 根据接收消息id删除
 *
 * @param ids              消息ids
 * @param removeCompletely true/false 是否彻底删除
 * @return true/false
 */
export function removeByIds (ids, removeCompletely) {
  return request({
    url: `${baseUrl}${ids}/${removeCompletely}`,
    method: HTTP_METHOD.DELETE
  })
}

/**
 * 根据接收消息id恢复
 *
 * @param ids              消息ids
 * @return true/false
 */
export function reductionByIds (ids) {
  return request({
    url: `${baseUrl}reduction/${ids}`,
    method: HTTP_METHOD.POST
  })
}

/**
 * 设置消息已读
 *
 * @param ids 消息ids
 * @return true/false
 */
export function setRead (ids) {
  return request({
    url: `${baseUrl}read/${ids}`,
    method: HTTP_METHOD.POST
  })
}
