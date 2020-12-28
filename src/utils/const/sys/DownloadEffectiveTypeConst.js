/**
 * 文件有效期类型
 *
 * @type {{FOREVER: string, GENERAL: string}}
 */
export const DOWNLOAD_EFFECTIVE_TYPE_CONST = {
  /**
   * 常规 - 经过一段时间会失效 （有效期为系统参数：downloadEffectiveExpire）
   */
  GENERAL: 'general',
  /**
   * 永久
   */
  FOREVER: 'forever'
}
