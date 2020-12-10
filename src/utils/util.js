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

export function isIE () {
  const bw = window.navigator.userAgent
  const compare = (s) => bw.indexOf(s) >= 0
  const ie11 = (() => 'ActiveXObject' in window)()
  return compare('MSIE') || ie11
}

/**
 * Remove loading animate
 * @param id parent element id or class
 * @param timeout
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
 * @param prefix 前缀
 * @returns {string}
 */
export function getUniqueID (prefix) {
  return prefix + Math.floor(Math.random() * (new Date()).getTime())
}

/**
 * 检查对象是否是数组类型
 *
 * @param obj {object} 待检查对象
 * @returns {boolean} true/false
 */
export function isArray (obj) {
  return obj && Array.isArray(obj)
}

/**
 * 判断是否为字符串类型
 *
 * @param obj {object} 待检查对象
 * @returns {boolean} true/false
 */
export function isString (obj) {
  return typeof obj === 'string'
}

/**
 * 判断字符串是否为`undefined`、`null`或`''`，反方法`isNotBlank(str)`
 *
 * @param str 待检查字符串
 * @returns {boolean} true/false
 */
export function isBlank (str) {
  return typeof str === 'undefined' || str === null || str === ''
}

/**
 * 判断字符串是否不为`undefined`、`null`或`''`，反方法`isBlank(str)`
 *
 * @param str 待检查字符串
 * @returns {boolean} true/false
 */
export function isNotBlank (str) {
  return !isBlank(str)
}

/**
 * 一维数组转树形结构
 *
 * @param data 数组
 * @param root 根节点
 * @param idTxt id属性名
 * @param pidTxt pId属性名
 * @param pushTxt children属性名
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

export function openView (router, to, tabName, query) {
  query = Object.assign((query || {}), { customTabName: tabName || '未命名' })
  router.push({
    path: to,
    query: query
  })
}

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
/** ****************** 字典 ********************/
/**
 * 根据字典类型获取字典数组
 *
 * @param dictType 字典类型
 * @returns 如没有返回`null` eg：[{...}, {...}]
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
 * @returns 如没有返回`null` eg：{1 : {...}, 2: {...}}
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
 * @returns 字典对象或`null`
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
 * @returns 字典名称或`null`
 */
export function getSysDictNameByQuery (dictType, code) {
  const dict = getSysDictObjectByQuery(dictType, code)
  if (dict != null) {
    return dict.name
  }
  return null
}
