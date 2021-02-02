import request from '@/utils/request'
import { HTTP_METHOD } from '@/utils/const/http/method'

const baseUrl = '/auth/sys/dept/'

/**
 * 新增
 *
 * @param pId 上级部门 id
 */
export function add (pId) {
  return request({
    url: `${baseUrl}add/${pId}`,
    method: HTTP_METHOD.GET
  })
}

/**
 * 删除
 *
 * @param id 部门id
 */
export function remove (id) {
  return request({
    url: `${baseUrl}${id}`,
    method: HTTP_METHOD.DELETE
  })
}

/**
 * 设置状态
 *
 * @param ids    部门ids
 * @param status 状态
 */
export function setStatus (ids, status) {
  return request({
    url: `${baseUrl}${ids}/status/${status}`,
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
 * @param id 菜单/部门 id
 */
export function get (id) {
  return request({
    url: `${baseUrl}${id}`,
    method: HTTP_METHOD.GET
  })
}

/**
 * 新增/修改页面获取机构类型option
 *
 * @param pId      上级id
 * @param deptType 类型
 */
export function selectDeptTypeOption (pId, deptType) {
  return request({
    url: `${baseUrl}dept/type/option`,
    method: HTTP_METHOD.GET,
    params: {
      pId,
      deptType
    }
  })
}

/**
 * 新增/修改页面获取父部门option
 *
 * @param pId      上级id
 * @param deptType 类型
 */
export function selectUpDeptOption (pId, deptType) {
  return request({
    url: `${baseUrl}up/dept/option`,
    method: HTTP_METHOD.GET,
    params: {
      pId,
      deptType
    }
  })
}

/**
 * 根据pId获取数据
 *
 * @param pId 父部门id
 * @return List<JsTree>
 */
export function selectByPId (pId) {
  return request({
    url: `${baseUrl}pId/${pId}`,
    method: HTTP_METHOD.GET
  })
}

/**
 * 搜索
 *
 * @param title 标题
 */
export function selectByTitle (title) {
  return request({
    url: `${baseUrl}title`,
    method: HTTP_METHOD.GET,
    params: {
      title
    }
  })
}

/**
 * 搜索
 *
 * @param params 查询条件
 */
export function selectDepartments (params) {
  return request({
    url: `${baseUrl}departments`,
    method: HTTP_METHOD.GET,
    params
  })
}
