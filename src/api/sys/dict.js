import request from '@/utils/request'
import HttpMethod from '@/constant/http-method'

const baseUrl = '/auth/sys/dict/'
const api = {
  selectByDictType: baseUrl + 'dict-type',
  add: baseUrl + 'add/',
  generateDictData: baseUrl + 'generate/dict/data'
}

export function select (parameter) {
  return request({
    url: baseUrl,
    method: HttpMethod.GET,
    params: parameter
  })
}

export function selectByDictType (parameter) {
  return request({
    url: api.selectByDictType,
    method: HttpMethod.GET,
    params: parameter
  })
}

export function add (id, dictType) {
  return request({
    url: baseUrl + id,
    method: HttpMethod.GET,
    params: {
      dictType: dictType
    }
  })
}

export function remove (ids) {
  return request({
    url: baseUrl + ids,
    method: HttpMethod.DELETE
  })
}

export function save (parameter) {
  return request({
    url: baseUrl,
    method: HttpMethod.POST,
    data: parameter
  })
}

export function get (id) {
  return request({
    url: baseUrl + id,
    method: HttpMethod.GET
  })
}

export function generateDictData () {
  return request({
    url: api.generateDictData,
    method: HttpMethod.POST
  })
}
