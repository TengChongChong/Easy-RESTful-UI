import request from '@/utils/request'
import { HTTP_METHOD } from '@/utils/const/http/method'

const baseUrl = '/auth/sys/dict/'

export function select (params) {
  return request({
    url: baseUrl,
    method: HTTP_METHOD.GET,
    params
  })
}

export function selectByDictType (dictType) {
  return request({
    url: `${baseUrl}dict-type/${dictType}`,
    method: HTTP_METHOD.GET
  })
}

export function add (id, dictType) {
  return request({
    url: `${baseUrl}add/${id || ''}`,
    method: HTTP_METHOD.GET,
    params: {
      dictType: dictType
    }
  })
}

export function remove (ids) {
  return request({
    url: `${baseUrl}${ids}`,
    method: HTTP_METHOD.DELETE
  })
}

export function save (data) {
  return request({
    url: baseUrl,
    method: HTTP_METHOD.POST,
    data
  })
}

export function get (id) {
  return request({
    url: `${baseUrl}${id}`,
    method: HTTP_METHOD.GET
  })
}

export function generateDictData () {
  return request({
    url: `${baseUrl}generate/dict/data`,
    method: HTTP_METHOD.POST
  })
}
