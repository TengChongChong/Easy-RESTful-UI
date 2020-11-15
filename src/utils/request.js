import axios from 'axios'
import store from '@/store'
import storage from 'store'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import qs from 'qs'
import { HttpStatus } from '@/utils/const/http-status'
import { SHOW_TYPE } from '@/utils/const/result'

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '请求方法不被允许。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。'
}

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 6000 // 请求超时时间
})

// 异常拦截处理器
const errorHandler = (error) => {
  if (error.response) {
    const response = error.response
    const { data, status } = error.response
    if (data && !data.success) {
      if (data.showType) {
        let message, description, method
        switch (data.showType) {
          case SHOW_TYPE.SILENT:
            // 静默
            break
          case SHOW_TYPE.NOTIFICATION_INFO:
            method = 'info'
            message = '信息'
            description = data.errorMessage
            break
          case SHOW_TYPE.NOTIFICATION_WARNING:
            method = 'warning'
            message = '警告'
            description = data.errorMessage
            break
          case SHOW_TYPE.NOTIFICATION_ERROR:
            method = 'error'
            message = '错误'
            description = data.errorMessage
            break
          case SHOW_TYPE.PAGE:
            method = 'page'
            // todo: 跳转到错误页面
            break
          default:
            break
        }
        if (message && method !== 'page') {
          notification[method]({
            message,
            description: description || codeMessage[response.status]
          })
        }
      } else {
        const { status, url } = error.response
        console.warn(`${url}响应状态码${status}，data.success不应为${data.success}`)
      }
    } else if (response && response.status) {
      // 用户没有权限（令牌、用户名、密码错误）
      if (HttpStatus.HTTP_UNAUTHORIZED === status) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
      } else {
        const errorText = codeMessage[response.status] || response.statusText
        const { status, url } = response
        notification.error({
          message: `请求错误 ${status}: ${url}`,
          description: errorText
        })
      }
    }
  } else {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常'
    })
  }
  return Promise.reject(error)
}

// request interceptor
request.interceptors.request.use(config => {
  const token = storage.get(ACCESS_TOKEN)
  // 如果 token 存在
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  if (token) {
    config.headers['Access-Token'] = token
  }
  if (config.method === 'post') {
    config.data = qs.stringify(config.data)
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  }
  return config
}, errorHandler)

// response interceptor
request.interceptors.response.use((response) => {
  return response.data
}, errorHandler)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, request)
  }
}

export default request

export {
  installer as VueAxios,
  request as axios
}
