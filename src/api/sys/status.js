import request from '@/utils/request'
import { HTTP_METHOD } from '@/utils/const/http/method'

/**
 * 系统状态
 */

const baseUrl = '/auth/sys/status/'

/**
 * Java Virtual Machine Specification信息
 *
 * @return JvmSpecInfo
 */
export function getJvmSpecInfo () {
  return request({
    url: `${baseUrl}jvm/spec/info`,
    method: HTTP_METHOD.GET
  })
}

/**
 * Java Virtual Machine Implementation信息
 *
 * @return JvmInfo
 */
export function getJvmInfo () {
  return request({
    url: `${baseUrl}jvm/info`,
    method: HTTP_METHOD.GET
  })
}
/**
 * Java Specification信息
 *
 * @return JavaSpecInfo
 */
export function getJavaSpecInfo () {
  return request({
    url: `${baseUrl}java/spec/info`,
    method: HTTP_METHOD.GET
  })
}
/**
 * Java Implementation信息
 *
 * @return JavaInfo
 */
export function getJavaInfo () {
  return request({
    url: `${baseUrl}java/info`,
    method: HTTP_METHOD.GET
  })
}
/**
 * Java运行时信息
 *
 * @return JavaRuntimeInfo
 */
export function getJavaRuntimeInfo () {
  return request({
    url: `${baseUrl}java/runtime/info`,
    method: HTTP_METHOD.GET
  })
}
/**
 * 系统信息
 *
 * @return OsInfo
 */
export function getOsInfo () {
  return request({
    url: `${baseUrl}os/info`,
    method: HTTP_METHOD.GET
  })
}
/**
 * 用户信息
 *
 * @return UserInfo
 */
export function getUserInfo () {
  return request({
    url: `${baseUrl}user/info`,
    method: HTTP_METHOD.GET
  })
}

/**
 * 当前主机网络地址信息
 *
 * @return HostInfo
 */
export function getHostInfo () {
  return request({
    url: `${baseUrl}host/info`,
    method: HTTP_METHOD.GET
  })
}

/**
 * 运行时信息，包括内存总大小、已用大小、可用大小等
 *
 * @return RuntimeInfo
 */
export function getRuntimeInfo () {
  return request({
    url: `${baseUrl}runtime/info`,
    method: HTTP_METHOD.GET
  })
}
