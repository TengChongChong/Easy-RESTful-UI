import request from '@/utils/request'
import { HTTP_METHOD } from '@/utils/const/http/method'

/**
 * 找回密码
 */

const baseUrl = '/sys/user/retrieve/password/'

/**
 * 发送重置密码邮件
 *
 * @param username {string} 用户名
 * @param email {string} 邮箱
 */
export function sendMail (username, email) {
  return request({
    url: `${baseUrl}email`,
    method: HTTP_METHOD.POST,
    data: {
      username, email
    }
  })
}

/**
 * 发送重置密码短信
 *
 * @param username {string} 用户名
 * @param phone {string} 手机号
 */
export function sendMessage (username, phone) {
  return request({
    url: `${baseUrl}message`,
    method: HTTP_METHOD.POST,
    data: {
      username, phone
    }
  })
}

/**
 * 验证用户名与校验码是否匹配
 *
 * @param username {string} 用户名
 * @param code     {string} 校验码
 */
export function verifiesCode (username, code) {
  return request({
    url: `${baseUrl}verifies/${username}/${code}`,
    method: HTTP_METHOD.GET
  })
}

/**
 * 验证用户名与校验码是否匹配
 *
 * @param username {string} 用户名
 * @param code     {string} 校验码
 * @param password {string} 密码
 */
export function resetPassword (username, code, password) {
  return request({
    url: `${baseUrl}reset/password/${username}/${code}`,
    method: HTTP_METHOD.POST,
    data: { password }
  })
}
