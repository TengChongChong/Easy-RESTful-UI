import request from '@/utils/request'
import { HTTP_METHOD } from '@/utils/const/http/method'

/**
 * 验证邮箱
 *
 * @param code 校验码
 */
export function verifies (code) {
  return request({
    url: '/sys/mail/verifies',
    method: HTTP_METHOD.POST,
    data: { code }
  })
}
