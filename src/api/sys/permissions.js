import request from '@/utils/request'
import { HTTP_METHOD } from '@/utils/const/http/method'

const baseUrl = '/auth/sys/permissions/'
const api = {
  add: baseUrl + 'add/',
  batchRemove: baseUrl + 'batch/',
  selectByPId: baseUrl + 'pId/',
  selectAll: baseUrl + 'all',
  selectByTitle: baseUrl + 'title',
  move: baseUrl + 'move'
}
/**
 * 新增
 *
 * @param pId 上级菜单/权限 id
 */
export function add (pId) {
  return request({
    url: api.add + pId,
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
 * 批量删除
 *
 * @param ids 权限ids
 */
export function batchRemove (ids) {
  return request({
    url: api.batchRemove + ids,
    method: HTTP_METHOD.DELETE
  })
}
/**
 * 设置状态
 *
 * @param ids    权限ids
 * @param status 状态
 */
export function setStatus (ids, status) {
  return request({
    url: baseUrl + ids + '/status/' + status,
    method: HTTP_METHOD.POST
  })
}
/**
 * 复制节点到目标id
 *
 * @param nodeIds  复制的节点ids [1,2,3]
 * @param targetId 目标节点id
 */
export function copyNodes (nodeIds, targetId) {
  return request({
    url: baseUrl + 'copy/' + nodeIds + '/to/' + targetId,
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
 * 根据pId获取数据
 *
 * @param pId 父权限id
 * @return List<JsTree>
 */
export function selectByPId (pId) {
  return request({
    url: api.selectByPId + pId,
    method: HTTP_METHOD.GET
  })
}
/**
 * 获取全部数据
 *
 * @return List<JsTree>
 */
export function selectAll () {
  return request({
    url: api.selectAll,
    method: HTTP_METHOD.GET
  })
}
/**
 * 搜索
 *
 * @param title 标题
 * @return List<JsTree>
 */
export function selectByTitle (title) {
  return request({
    url: api.selectByTitle,
    method: HTTP_METHOD.GET,
    params: {
      title
    }
  })
}

/**
 * 拖动改变目录或顺序
 *
 * @param id          拖动的菜单/权限id
 * @param parent      拖动后的父id
 * @param oldParent   拖动前的id
 * @param position    拖动前的下标
 * @param oldPosition 拖动后的下标
 */
export function move (id, parent, oldParent, position, oldPosition) {
  return request({
    url: api.move,
    method: HTTP_METHOD.POST,
    data: {
      id, parent, oldParent, position, oldPosition
    }
  })
}
