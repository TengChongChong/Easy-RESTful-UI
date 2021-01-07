import request from '@/utils/request'
import { HTTP_METHOD } from '@/utils/const/http/method'

const baseUrl = '/auth/sys/dict/type/'
const api = {
  selectAll: baseUrl + 'all'
}

export function select (params) {
  return request({
    url: baseUrl,
    method: HTTP_METHOD.GET,
    params
  })
}

export function selectAll () {
  return request({
    url: api.selectAll,
    method: HTTP_METHOD.GET
  })
}

export function remove (ids) {
  return request({
    url: baseUrl + ids,
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