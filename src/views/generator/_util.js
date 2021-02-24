/**
 * 生成模板
 * @type {object}
 */
import { isNotBlank } from '@/utils/util'
import { preferenceSetting } from '@/views/generator/_setting'

export const generatorTemplate = {
  default: {
    file: ['model', 'dao', 'mapping', 'service', 'serviceImpl', 'controller', 'List.vue', 'Input.vue', 'api.js'],
    method: ['add', 'remove', 'save', 'select']
  },
  defaultOnlySelect: {
    file: ['model', 'dao', 'mapping', 'service', 'serviceImpl', 'controller', 'List.vue', 'api.js'],
    method: ['select']
  },
  bizAndDao: {
    file: ['model', 'dao', 'mapping', 'service', 'serviceImpl'],
    method: ['add', 'remove', 'save', 'select']
  },
  dao: {
    file: ['model', 'dao', 'mapping'],
    method: ['add', 'remove', 'save', 'select']
  }
}

/**
 * 获取controller中@RequestMapping值
 * @param tableName {string} 表名
 * @returns {string}
 */
export function getControllerMapping (tableName) {
  return tableName.replace(/_/g, '/')
}

/**
 * 获取controller方法中@RequiresPermissions值
 * @param tableName {string} 表名
 * @returns {string}
 */
export function getPermissionsCode (tableName) {
  return tableName.replace(/_/g, ':')
}

/**
 * 根据偏好设置获取checkbox是否默认选中
 *
 * @param propertyName {string} 列名
 * @param setting 偏好设置
 * @return {boolean} 选中状态
 */
export function getCheckStatusByPreferenceSetting (propertyName, setting) {
  return setting && setting.indexOf(propertyName) > -1
}
/**
 * 根据偏好设置获取elementType/matching默认值
 *
 * @param propertyName {string} 列名
 * @param setting {object} 偏好设置
 * @param defaultValue {string} 默认值
 * @param propertyType {string|null} 属性类型
 * @param ignoreDict {boolean} 是否
 * @return {string} 选中状态
 */
export function getDefaultDictByPreferenceSetting ({ propertyName, setting, defaultValue, propertyType, ignoreDict = false }) {
  // 如果有与此字段名称相同的字典类型，则认为此字段使用字典下拉
  if (!ignoreDict) {
    // eslint-disable-next-line no-undef
    if (SYS_DICT[propertyName]) {
      return 'select'
    }
  }

  if (typeof setting !== 'undefined') {
    for (const type in setting) {
      if (setting[type].indexOf(propertyName) > -1) {
        return type
      }
    }
  }
  // 根据属性类型获取
  if (isNotBlank(propertyType)) {
    for (const type in preferenceSetting.number) {
      if (preferenceSetting.number[type] === propertyType) {
        return 'number'
      }
    }
    for (const type in preferenceSetting.date) {
      if (preferenceSetting.date[type] === propertyType) {
        return 'date'
      }
    }
  }
  return defaultValue
}

export function selectQueryItems (fieldSet) {
  const queryItems = []
  if (fieldSet) {
    fieldSet.map(item => {
      if (item.showInSearch && item.elementType !== 'hidden') {
        queryItems.push(item)
      }
    })
  }
  return queryItems
}

export function selectFormItems (fieldSet) {
  const formItems = []
  if (fieldSet) {
    fieldSet.map(item => {
      if (item.showInInput && item.elementType !== 'hidden') {
        formItems.push(item)
      }
    })
  }
  return formItems
}

/**
 * 查找启用字段
 *
 * @param fieldSet 设置
 * @param field 字段名
 * @return {[]}
 */
export function selectEnableItems (fieldSet, field) {
  const items = []
  if (fieldSet) {
    fieldSet.map(item => {
      if (item[field]) {
        items.push(item)
      }
    })
  }
  return items
}
