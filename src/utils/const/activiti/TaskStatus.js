/**
 * 任务状态
 *
 * @type {{COMPLETED: number, RESCINDED: number, IN_PROCESS: number}}
 */
export const TASK_STATUS = {
  /**
   * 办理中
   */
  IN_PROCESS: 1,
  /**
   * 已撤销
   */
  RESCINDED: -1,
  /**
   * 已办结
   */
  COMPLETED: 2
}
