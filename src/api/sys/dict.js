import request from '@/utils/request'
import { HTTP_METHOD } from '@/utils/const/http/method'

const baseUrl = '/auth/sys/dict/'
const api = {
  selectByDictType: baseUrl + 'dict-type/',
  add: baseUrl + 'add/',
  generateDictData: baseUrl + 'generate/dict/data'
}

export function select (params) {
  return request({
    url: baseUrl,
    method: HTTP_METHOD.GET,
    params
  })
}

export function selectByDictType (dictType) {
  return request({
    url: api.selectByDictType + dictType,
    method: HTTP_METHOD.GET
  })
}

export function add (id, dictType) {
  return request({
    url: api.add + (id || ''),
    method: HTTP_METHOD.GET,
    params: {
      dictType: dictType
    }
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

export function get (id) {
  return request({
    url: baseUrl + id,
    method: HTTP_METHOD.GET
  })
}

export function generateDictData () {
  return request({
    url: api.generateDictData,
    method: HTTP_METHOD.POST
  })
}
