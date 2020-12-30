/**
 * 消息
 */
export const MESSAGE_CONST = {
  //= === 消息类型
  /**
   * 消息类型-通知
   */
  TYPE_NOTICE: 'notice',
  /**
   * 消息类型-事件
   */
  TYPE_EVENT: 'event',
  /**
   * 消息类型-日志
   */
  TYPE_JOURNAL: 'journal',

  // 重要
  /**
   * 不重要
   */
  IMPORTANT_NO: 0,
  /**
   * 重要
   */
  IMPORTANT_YES: 1,

  // 状态
  /**
   * 草稿
   */
  STATUS_DRAFT: '0',
  /**
   * 已发送
   */
  STATUS_HAS_BEEN_SENT: '1',
  /**
   * 已撤销
   */
  STATUS_RESCINDED: '-1',

  // 标星
  /**
   * 标星
   */
  STAR_YES: 1,
  /**
   * 未标星
   */
  STAR_NO: 0,

  // 收信状态
  /**
   * 已读
   */
  RECEIVE_STATUS_ALREADY_READ: '1',
  /**
   * 未读
   */
  RECEIVE_STATUS_UNREAD: '0',
  /**
   * 已删除
   */
  RECEIVE_STATUS_DELETED: '-1'
}
