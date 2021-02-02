import request from '@/utils/request'
import { HTTP_METHOD } from '@/utils/const/http/method'

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export function login (parameter) {
  return request({
    url: '/auth/login',
    method: HTTP_METHOD.POST,
    data: parameter
  })
}

export function logout () {
  return request({
    url: '/logout',
    method: HTTP_METHOD.POST
  })
}

export function getInfo () {
  return request({
    url: '/auth/sys/user/current',
    method: HTTP_METHOD.GET
  })
}

export function getSmsCaptcha (parameter) {
  return request({
    url: '/account/sms',
    method: 'post',
    data: parameter
  })
}
