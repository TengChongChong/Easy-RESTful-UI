import request from '@/utils/request'
import { HTTP_METHOD } from '@/utils/const/http/method'

/**
 * 验证码
 */

/**
 * 发送绑定密保手机验证码
 *
 * @param phone 手机号
 */
export function sendBindingPhoneCaptcha (phone) {
  return request({
    url: '/auth/sys/binding/phone/captcha',
    method: HTTP_METHOD.GET,
    params: { phone }
  })
}
