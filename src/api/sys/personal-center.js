import request from '@/utils/request'
import { HTTP_METHOD } from '@/utils/const/http/method'

/**
 * 个人中心
 */

const baseUrl = '/auth/sys/user/personal/center/'

/**
 * 当前用户
 */
export function currentUser () {
  return request({
    url: baseUrl + 'current/user',
    method: HTTP_METHOD.GET
  })
}

/**
 * 密码修改
 *
 * @param oldPassword 原密码
 * @param password    新密码
 * @param passwordStrength 密码强度
 */
export function changePassword (oldPassword, password, passwordStrength) {
  return request({
    url: baseUrl + 'change/password',
    method: HTTP_METHOD.POST,
    data: {
      oldPassword, password, passwordStrength
    }
  })
}

/**
 * 保存用户头像
 *
 * @param path 文件路径
 */
export function saveUserAvatar (path) {
  return request({
    url: baseUrl + 'user/avatar',
    method: HTTP_METHOD.POST,
    data: {
      path
    }
  })
}

/**
 * 保存用户信息
 *
 * @param params 用户信息
 */
export function saveUserInfo (params) {
  return request({
    url: baseUrl + 'user/info',
    method: HTTP_METHOD.POST,
    data: params
  })
}

/**
 * 申请绑定密保邮箱
 *
 * @param email 邮箱地址
 */
export function applicationBindingEmail (email) {
  return request({
    url: baseUrl + 'email',
    method: HTTP_METHOD.POST,
    data: { email }
  })
}

/**
 * 绑定密保手机
 *
 * @param params {{ phone: number|string, captcha: number|string }}
 */
export function bindingPhone (params) {
  return request({
    url: baseUrl + 'phone',
    method: HTTP_METHOD.POST,
    data: params
  })
}

/**
 * 保存用户设置
 *
 * @param params 用户设置
 */
export function saveUserSetting (params) {
  return request({
    url: baseUrl + 'user/setting',
    method: HTTP_METHOD.POST,
    data: params
  })
}
