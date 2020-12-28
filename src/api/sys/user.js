import request from '@/utils/request'
import { HTTP_METHOD } from '@/utils/const/http/method'

const baseUrl = '/auth/sys/user/'

export function select (params) {
  return request({
    url: baseUrl,
    method: HTTP_METHOD.GET,
    params
  })
}

/**
 * 搜索
 *
 * @param keyword 关键字
 */
export function selectByKeyword (keyword) {
  return request({
    url: baseUrl + 'search',
    method: HTTP_METHOD.GET,
    params: {
      keyword
    }
  })
}

/**
 * 新增
 *
 * @param deptId 部门id
 */
export function add (deptId) {
  return request({
    url: baseUrl + 'add/' + deptId,
    method: HTTP_METHOD.GET
  })
}

/**
 * 删除
 *
 * @param id 权限id
 */
export function remove (id) {
  return request({
    url: baseUrl + id,
    method: HTTP_METHOD.DELETE
  })
}

/**
 * 禁用用户
 *
 * @param ids    用户ids
 */
export function disableUser (ids) {
  return request({
    url: baseUrl + 'disable/user/' + ids,
    method: HTTP_METHOD.POST
  })
}
/**
 * 启用用户
 *
 * @param ids    用户ids
 */
export function enableUser (ids) {
  return request({
    url: baseUrl + 'enable/user/' + ids,
    method: HTTP_METHOD.POST
  })
}

/**
 * 重置密码
 *
 * @param ids 用户ids
 */
export function resetPassword (ids) {
  return request({
    url: baseUrl + 'reset/password/' + ids,
    method: HTTP_METHOD.POST
  })
}

/**
 * 保存
 *
 * @param params 表单内容
 */
export function save (params) {
  return request({
    url: baseUrl,
    method: HTTP_METHOD.POST,
    data: params
  })
}

/**
 * 详情
 *
 * @param id 菜单/权限 id
 */
export function get (id) {
  return request({
    url: baseUrl + id,
    method: HTTP_METHOD.GET
  })
}

/**
 * 获取当前登录用户
 */
export function current () {
  return request({
    url: baseUrl + 'current',
    method: HTTP_METHOD.GET
  })
}

/**
 * 查询用户列表 Activiti
 *
 * @param params 查询条件
 */
export function selectUser (params) {
  return request({
    url: baseUrl + 'users',
    method: HTTP_METHOD.GET,
    params
  })
}
