import request from '@/utils/request'
import HttpMethod from '@/constant/http-method'

const baseUrl = '/auth/sys/dict/type/'
const api = {
  selectAll: baseUrl + 'all'
}

export function select (parameter) {
  return request({
    url: baseUrl,
    method: HttpMethod.GET,
    params: parameter
  })
}

export function selectAll () {
  return request({
    url: api.selectAll,
    method: HttpMethod.GET
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
