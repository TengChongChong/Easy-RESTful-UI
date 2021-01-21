import notification from 'ant-design-vue/lib/notification'
/**
 * 默认提示文字
 */
const commonTips = {
  /**
   * 删除
   */
  remove: {
    title: '确定要删除吗？',
    subtitle: '删除后无法恢复，请谨慎操作',
    success: '数据已删除'
  },
  /**
   * 保存
   */
  save: '数据已保存',
  success: '成功',
  info: '消息',
  warn: '警告',
  error: '错误',
  fail: '失败'
}

/**
 * 操作成功提示
 *
 * @param description {string|null} 提示文字
 */
export function successTip (description) {
  notification.success({
    message: commonTips.success,
    description: description || '操作成功'
  })
}

/**
 * 保存成功提示
 */
export function saveSuccessTip () {
  notification.success({
    message: commonTips.success,
    description: commonTips.save
  })
}

/**
 * 删除成功提示
 *
 * @param type add | update
 */
export function removeSuccessTip () {
  notification.success({
    message: commonTips.success,
    description: commonTips.remove.success
  })
}
