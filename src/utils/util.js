import * as moment from 'moment'
import { DATE_PATTERN } from '@/utils/const/datePattern'

/**
 * 根据时间获取xx号欢迎
 *
 * @return {string}
 */
export function timeFix () {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'
}

/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent () {
  const event = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  event.eventType = 'message'
  window.dispatchEvent(event)
}

/**
 * 滚动回调，添加延迟防止多次触发
 *
 * @param callback {function}
 */
export function handleScrollHeader (callback) {
  let timer = 0

  let beforeScrollTop = window.pageYOffset
  callback = callback || function () {
  }
  window.addEventListener(
    'scroll',
    event => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        let direction = 'up'
        const afterScrollTop = window.pageYOffset
        const delta = afterScrollTop - beforeScrollTop
        if (delta === 0) {
          return false
        }
        direction = delta > 0 ? 'down' : 'up'
        callback(direction)
        beforeScrollTop = afterScrollTop
      }, 50)
    },
    false
  )
}

/**
 * 是否为IE浏览器
 *
 * @return {boolean} true/false
 */
export function isIE () {
  const bw = window.navigator.userAgent
  const compare = (s) => bw.indexOf(s) >= 0
  const ie11 = (() => 'ActiveXObject' in window)()
  return compare('MSIE') || ie11
}

/**
 * 移除加载动画
 *
 * @param id {string} parent element id or class
 * @param timeout {number} 延迟
 */
export function removeLoadingAnimate (id = '', timeout = 1500) {
  if (id === '') {
    return
  }
  setTimeout(() => {
    document.body.removeChild(document.getElementById(id))
  }, timeout)
}

/**
 * 生成一个指定前缀的 unique ID
 *
 * @param prefix {string|number} 前缀
 * @return {string}
 */
export function getUniqueID (prefix) {
  return prefix + Math.floor(Math.random() * (new Date()).getTime())
}

/**
 * 检查对象是否是数组类型
 *
 * @param obj {object} 待检查对象
 * @return {boolean} true/false
 */
export function isArray (obj) {
  return obj && Array.isArray(obj)
}

/**
 * 判断是否为字符串类型
 *
 * @param obj {object} 待检查对象
 * @return {boolean} true/false
 */
export function isString (obj) {
  return typeof obj === 'string'
}

/**
 * 判断字符串是否为`undefined`、`null`或`''`，反方法`isNotBlank(str)`
 *
 * @param str {string} 待检查字符串
 * @return {boolean} true/false
 */
export function isBlank (str) {
  return typeof str === 'undefined' || str === null || str === ''
}

/**
 * 判断字符串是否不为`undefined`、`null`或`''`，反方法`isBlank(str)`
 *
 * @param str {string} 待检查字符串
 * @return {boolean} true/false
 */
export function isNotBlank (str) {
  return !isBlank(str)
}

/**
 * 一维数组转树形结构
 *
 * @param data {array} 数组
 * @param root {string} 根节点
 * @param idTxt {string} id属性名
 * @param pidTxt {string} pId属性名
 * @param pushTxt {string} children属性名
 * @return {array}
 */
export function convertTree (data, root = '#', idTxt = 'id', pidTxt = 'pId', pushTxt = 'children') {
  function getNode (id) {
    const node = []
    for (let i = 0; i < data.length; i += 1) {
      if (data[i][pidTxt] === id) {
        const tempList = getNode(data[i][idTxt])
        if (tempList.length > 0) {
          data[i][pushTxt] = tempList
        }
        node.push(data[i])
      }
    }
    return node
  }

  // 使用根节点
  return getNode(root)
}

/**
 * 获取某dom到根元素的offsetLeft/offsetTop
 *
 * @param element element
 * @return {{actualTop: *, actualLeft: number}}
 */
export function getElementOffset (element) {
  let actualTop = element.offsetTop
  let actualLeft = element.offsetLeft

  let current = element.offsetParent

  while (current !== null) {
    actualTop += current.offsetTop
    actualLeft += current.offsetLeft
    current = current.offsetParent
  }
  return { actualLeft, actualTop }
}

/**
 * 打开页面
 *
 * @param router router
 * @param to {string} 路由地址
 * @param tabName {string} 标签页名称
 * @param query {object} 参数
 */
export function openView (router, to, tabName, query) {
  query = Object.assign((query || {}), { customTabName: tabName || '未命名' })
  router.push({
    path: to,
    query: query
  })
}

/**
 * 克隆对象
 *
 * @param source {object} 被克隆对象
 * @param ignore {string} 忽略属性
 * @return {object}
 */
export function deepClone (source, ignore) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (!ignore.includes(keys)) {
      if (source[keys] && typeof source[keys] === 'object') {
        targetObj[keys] = deepClone(source[keys], ignore)
      } else {
        targetObj[keys] = source[keys]
      }
    }
  })
  return targetObj
}

/**
 * 格式化时间
 *
 * @param date {Date} 时间
 * @param datePattern {string} 格式
 */
export function formatDate (date, datePattern = DATE_PATTERN.NORM_DATETIME_MINUTE_PATTERN) {
  return date ? moment(date).format(datePattern) : '-'
}

/**
 * 格式化时间
 *
 * @param date {date} 时间
 */
export function fromNow (date) {
  moment.locale('zh-cn')
  if (date) {
    // 如果超过1年，使用YYYY-MM-DD方式显示
    if (date < moment().subtract(1, 'years')) {
      return moment(date).format(DATE_PATTERN.NORM_DATE_PATTERN)
    } else {
      return moment(date).fromNow()
    }
  } else {
    return '-'
  }
}

/**
 * 下载文件
 *
 * @param id {string} 文件下载id
 */
export function downloadFileById (id) {
  downloadFile(`${process.env.VUE_APP_API_BASE_URL}/download/${id}`)
}

/**
 * 下载文件
 *
 * @param url {string} 下载地址（必要）
 */
export function downloadFile (url) {
  const form = document.createElement('form')
  form.setAttribute('action', url)
  form.setAttribute('method', 'post')
  form.setAttribute('style', 'display:none')
  document.body.appendChild(form)
  form.submit()
  document.body.removeChild(form)
}

/**
 * 在父节点中查找table
 *
 * @param vm vm
 * @return table {Vue | Element | Vue[] | Element[]} table
 */
export function getTableNode (vm) {
  let $parent = vm.$parent
  while (!$parent.$refs.eTable && $parent.$parent) {
    $parent = $parent.$parent
  }
  if (!$parent) {
    console.error('获取table失败')
  }
  return $parent.$refs.eTable
}

/**
 * 查询
 *
 * @param vm vm
 */
export function refreshList (vm) {
  getTableNode(vm).refresh(true)
}

/**
 * 全屏
 *
 * @param element {object} 要全屏的元素
 */
export function launchFullScreen (element = document.documentElement) {
  if (element.requestFullscreen) {
    element.requestFullscreen()
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen()
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen()
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen()
  }
}

/**
 * 退出全屏
 */
export function exitFullscreen () {
  if (document.exitFullscreen) {
    document.exitFullscreen()
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen()
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen()
  }
}

/**
 * 根据字典类型获取字典数组
 *
 * @param dictType 字典类型
 * @return {null | array}
 */
export function getSysDictArrayByDictType (dictType) {
  if (typeof SYS_DICT !== 'undefined' && isNotBlank(dictType)) {
    // eslint-disable-next-line no-undef
    return SYS_DICT[dictType]
  }
  return null
}

/**
 * 根据字典类型获取字典对象
 *
 * @param dictType 字典类型
 * @return {null | object}
 */
export function getSysDictionariesObjectByDictType (dictType) {
  const dictionaries = getSysDictArrayByDictType(dictType)
  if (dictionaries != null && dictionaries.length > 0) {
    const dictionariesObject = {}
    dictionaries.map((dict) => {
      dictionariesObject[dict.code] = dict
    })
    return dictionariesObject
  }
  return null
}

/**
 * 根据字典类型与编码获取字典信息
 *
 * @param dictType 字典类型
 * @param code 代码
 * @return {null | object}
 */
export function getSysDictObjectByQuery (dictType, code) {
  if (typeof code === 'number') {
    code = code.toString()
  }
  const dictionaries = getSysDictArrayByDictType(dictType)
  if (dictionaries != null && dictionaries.length > 0) {
    for (let i = 0; i < dictionaries.length; i++) {
      if (dictionaries[i].code === code) {
        return dictionaries[i]
      }
    }
  }
  return null
}

/**
 * 根据字典类型与编码获取字典名称
 *
 * @param dictType 字典类型
 * @param code 编码
 * @return {null | String}
 */
export function getSysDictNameByQuery (dictType, code) {
  const dict = getSysDictObjectByQuery(dictType, code)
  if (dict != null) {
    return dict.name
  }
  return null
}
