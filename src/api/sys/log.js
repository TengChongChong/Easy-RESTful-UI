import request from '@/utils/request'
import { HTTP_METHOD } from '@/utils/const/http/method'

const baseUrl = '/auth/sys/log/'

export function select (params) {
  return request({
    url: baseUrl,
    method: HTTP_METHOD.GET,
    params
  })
}

export function get (id) {
  return request({
    url: `${baseUrl}${id}`,
    method: HTTP_METHOD.GET
  })
}
