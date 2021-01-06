import request from '@/utils/request'
import { HTTP_METHOD } from '@/utils/const/http/method'

const userApi = {
  Login: '/auth/login',
  Logout: '/logout',
  ForgePassword: '/auth/forge-password',
  Register: '/auth/register',
  twoStepCode: '/auth/2step-code',
  SendSms: '/account/sms',
  SendSmsErr: '/account/sms_err',
  // get my info
  UserInfo: '/auth/sys/user/current',
  UserMenu: '/user/nav'
}

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
    url: userApi.Login,
    method: HTTP_METHOD.POST,
    data: parameter
  })
}

export function logout () {
  return request({
    url: userApi.Logout,
    method: HTTP_METHOD.POST
  })
}

export function getInfo () {
  return request({
    url: userApi.UserInfo,
    method: HTTP_METHOD.GET
  })
}

export function getSmsCaptcha (parameter) {
  return request({
    url: userApi.SendSms,
    method: 'post',
    data: parameter
  })
}
