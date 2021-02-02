/**
 * 权限标识
 */
export const ACTIVITI_PERMISSIONS_CODE = {
  // 流程跟踪
  HISTORIC_SELECT_ALL: 'activiti:historic:select:all',
  // 我发起的
  HISTORIC_SELECT_MY: 'activiti:historic:select:my',
  // 我办理的
  HISTORIC_SELECT_PARTICIPATE: 'activiti:historic:select:participate',

  // 流程模型 - 部署流程
  MODEL_DEPLOYMENT: 'activiti:model:deployment',
  // 流程模型 - 删除
  MODEL_REMOVE: 'activiti:model:remove',
  // 流程模型 - 保存/修改
  MODEL_SAVE: 'activiti:model:save',
  // 流程模型 - 查看
  MODEL_SELECT: 'activiti:model:select',

  // 流程管理 - 激活
  PROCESS_ACTIVATION: 'activiti:process:activation',
  // 流程管理 - 删除
  PROCESS_REMOVE: 'activiti:process:remove',
  // 流程管理 - 保存
  PROCESS_SAVE: 'activiti:process:save',
  // 流程管理 - 查看
  PROCESS_SELECT: 'activiti:process:select',
  // 流程管理 - 挂起
  PROCESS_SUSPEND: 'activiti:process:suspend'
}
