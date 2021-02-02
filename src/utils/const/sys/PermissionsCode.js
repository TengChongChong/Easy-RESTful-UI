/**
 * 系统管理 权限标识
 */
export const SYS_PERMISSIONS_CODE = {
  // 角色 - 拖动
  SYS_ROLE_MOVE: 'sys:role:move',
  // 角色- 删除
  SYS_ROLE_REMOVE: 'sys:role:remove',
  // 角色 - 保存
  SYS_ROLE_SAVE: 'sys:role:save',
  // 角色 - 查看
  SYS_ROLE_SELECT: 'sys:role:select',
  // 角色 - 更改状态
  SYS_ROLE_STATUS: 'sys:role:status',

  // 部门 - 禁用
  SYS_DEPT_DISABLE: 'sys:dept:disable',
  // 部门 - 启用
  SYS_DEPT_ENABLE: 'sys:dept:enable',
  // 部门 - 删除
  SYS_DEPT_REMOVE: 'sys:dept:remove',
  // 部门 - 保存
  SYS_DEPT_SAVE: 'sys:dept:save',
  // 部门 - 查看
  SYS_DEPT_SELECT: 'sys:dept:select',

  // 部门类型 - 拖动
  SYS_DEPT_TYPE_MOVE: 'sys:dept:type:move',
  // 部门类型 - 删除
  SYS_DEPT_TYPE_REMOVE: 'sys:dept:type:remove',
  // 部门类型 - 保存
  SYS_DEPT_TYPE_SAVE: 'sys:dept:type:save',
  // 部门类型 - 查看
  SYS_DEPT_TYPE_SELECT: 'sys:dept:type:select',
  // 部门类型 - 更改状态
  SYS_DEPT_TYPE_STATUS: 'sys:dept:type:status',

  // 用户 - 禁用
  SYS_USER_DISABLE: 'sys:user:disable',
  // 用户 - 启用
  SYS_USER_ENABLE: 'sys:user:enable',
  // 用户 - 删除
  SYS_USER_REMOVE: 'sys:user:remove',
  // 用户 - 重置密码
  SYS_USER_RESET_PASSWORD: 'sys:user:reset:password',
  // 用户 - 保存
  SYS_USER_SAVE: 'sys:user:save',
  // 用户 - 查看
  SYS_USER_SELECT: 'sys:user:select',

  // 系统参数 - 删除
  SYS_CONFIG_REMOVE: 'sys:config:remove',
  // 系统参数 - 保存
  SYS_CONFIG_SAVE: 'sys:config:save',
  // 系统参数 - 查看
  SYS_CONFIG_SELECT: 'sys:config:select',

  // 字典 - 更新字典资源
  SYS_DICT_GENERATE: 'sys:dict:generate',
  // 字典 - 删除
  SYS_DICT_REMOVE: 'sys:dict:remove',
  // 字典 - 保存
  SYS_DICT_SAVE: 'sys:dict:save',
  // 字典 - 查看
  SYS_DICT_SELECT: 'sys:dict:select',
  // 字典 - 更改状态
  SYS_DICT_SELECT_STATUS: 'sys:dict:select:status',
  // 字典类型 - 删除
  SYS_DICT_TYPE_REMOVE: 'sys:dict:type:remove',
  // 字典类型 - 保存
  SYS_DICT_TYPE_SAVE: 'sys:dict:type:save',
  // 字典类型 - 查看
  SYS_DICT_TYPE_SELECT: 'sys:dict:type:select',

  // 导入 - 删除
  SYS_IMPORT_EXCEL_TEMPLATE_REMOVE: 'sys:import:excel:template:remove',
  // 导入 - 保存
  SYS_IMPORT_EXCEL_TEMPLATE_SAVE: 'sys:import:excel:template:save',
  // 导入 - 查看
  SYS_IMPORT_EXCEL_TEMPLATE_SELECT: 'sys:import:excel:template:select',

  // 消息 - 删除
  SYS_MESSAGE_REMOVE: 'sys:message:remove',
  // 消息 - 保存
  SYS_MESSAGE_SAVE: 'sys:message:save',
  // 消息 - 查看
  SYS_MESSAGE_SELECT: 'sys:message:select',

  // 菜单 - 拖动
  SYS_PERMISSIONS_MOVE: 'sys:permissions:move',
  // 菜单 - 删除
  SYS_PERMISSIONS_REMOVE: 'sys:permissions:remove',
  // 菜单 - 保存
  SYS_PERMISSIONS_SAVE: 'sys:permissions:save',
  // 菜单 - 查看
  SYS_PERMISSIONS_SELECT: 'sys:permissions:select',
  // 菜单 - 更改状态
  SYS_PERMISSIONS_STATUS: 'sys:permissions:status',

  /**
   * == 系统监控
   */
  // 异常日志 - 删除
  SYS_EXCEPTION_REMOVE: 'sys:exception:remove',
  // 异常日志 - 查看
  SYS_EXCEPTION_SELECT: 'sys:exception:select',
  // 访问日志 - 查看
  SYS_LOG_SELECT: 'sys:log:select',
  // 在线用户 - 踢出
  SYS_ONLINE_FORCE: 'sys:online:force',
  // 在线用户 - 查看
  SYS_ONLINE_SELECT: 'sys:online:select',
  // redis - 删除
  SYS_REDIS_REMOVE: 'sys:redis:remove',
  // redis - 保存
  SYS_REDIS_SAVE: 'sys:redis:save',
  // redis - 查看
  SYS_REDIS_SELECT: 'sys:redis:select',
  // 服务器状态 - 查看
  SYS_STATUS_SELECT: 'sys:status:select'
}
