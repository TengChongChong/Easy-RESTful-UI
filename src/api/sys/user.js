import request from '@/utils/request'
import { HTTP_METHOD } from '@/utils/const/http/method'

const baseUrl = '/auth/sys/user/'

/**
 * 列表
 *
 * @param params 查询条件
 * @return Page<SysUser>
 */
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
 * @return Page<SysUser>
 */
export function selectByKeyword (keyword) {
  return request({
    url: baseUrl + 'keyword',
    method: HTTP_METHOD.GET,
    params: {
      keyword
    }
  })
}

/**
 * 获取指定用户信息
 *
 * @param ids ids
 * @return List<SysUser>
 */
export function selectUsersByIds (ids) {
  return request({
    url: baseUrl + 'users/' + ids,
    method: HTTP_METHOD.GET
  })
}

/**
 * 新增
 *
 * @param deptId 部门id
 * @return SysUser
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
 * @return true/false
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
 * @return true/false
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
 * @return true/false
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
 * @return true/false
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
 * @return SysUser
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
 * @return SysUser
 */
export function get (id) {
  return request({
    url: baseUrl + id,
    method: HTTP_METHOD.GET
  })
}

/**
 * 获取当前登录用户
 * @return SysUser
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
 * Page<SysUser>
 */
export function selectUser (params) {
  return request({
    url: baseUrl + 'users',
    method: HTTP_METHOD.GET,
    params
  })
}
