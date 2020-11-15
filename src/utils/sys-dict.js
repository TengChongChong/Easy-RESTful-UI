export const SYS_DICT = {
  'suspensionState': [{
    'css': 'green',
    'code': '1',
    'icon': '',
    'tips': '',
    'dictType': 'suspensionState',
    'pCode': '',
    'name': '激活'
  }, {
    'css': 'orange',
    'code': '2',
    'icon': '',
    'tips': '',
    'dictType': 'suspensionState',
    'pCode': '',
    'name': '挂起'
  }],
  'permissionsStatus': [{
    'css': 'green',
    'code': '1',
    'icon': '',
    'tips': '',
    'dictType': 'permissionsStatus',
    'pCode': '',
    'name': '启用'
  }, { 'css': 'red', 'code': '2', 'icon': '', 'tips': '', 'dictType': 'permissionsStatus', 'pCode': '', 'name': '禁用' }],
  'redisPrefix': [{
    'css': '',
    'code': 'account:',
    'icon': 'la la-unlock',
    'tips': '',
    'dictType': 'redisPrefix',
    'pCode': '',
    'name': 'account:'
  }, {
    'css': '',
    'code': 'shiro:session:',
    'icon': 'la la-users',
    'tips': '',
    'dictType': 'redisPrefix',
    'pCode': '',
    'name': 'shiro:session:'
  }, {
    'css': '',
    'code': 'shiro:authorization:',
    'icon': 'la la-expeditedssl',
    'tips': '',
    'dictType': 'redisPrefix',
    'pCode': '',
    'name': 'shiro:authorization:'
  }, {
    'css': '',
    'code': 'sys:config:',
    'icon': 'flaticon-settings-1',
    'tips': '',
    'dictType': 'redisPrefix',
    'pCode': '',
    'name': 'sys:config:'
  }, {
    'css': '',
    'code': 'account:session:',
    'icon': '',
    'tips': '当前会话尝试登录次数',
    'dictType': 'redisPrefix',
    'pCode': '',
    'name': 'account:session:'
  }, {
    'css': '',
    'code': 'reset:password:verification:code:',
    'icon': '',
    'tips': '',
    'dictType': 'redisPrefix',
    'pCode': '',
    'name': 'reset:password:verification:code:'
  }],
  'userStatus': [{
    'css': 'green',
    'code': '1',
    'icon': '',
    'tips': '',
    'dictType': 'userStatus',
    'pCode': '',
    'name': '启用'
  }, {
    'css': 'red',
    'code': '2',
    'icon': '',
    'tips': '',
    'dictType': 'userStatus',
    'pCode': '',
    'name': '禁用'
  }, { 'css': 'red', 'code': '0', 'icon': '', 'tips': '', 'dictType': 'userStatus', 'pCode': '', 'name': '已删除' }],
  'schedulerJobStatus': [{
    'css': 'green',
    'code': '1',
    'icon': '',
    'tips': '',
    'dictType': 'schedulerJobStatus',
    'pCode': '',
    'name': '开启'
  }, {
    'css': 'orange',
    'code': '2',
    'icon': '',
    'tips': '',
    'dictType': 'schedulerJobStatus',
    'pCode': '',
    'name': '暂停'
  }],
  'dataType': [{
    'css': '',
    'code': 'number',
    'icon': '',
    'tips': '',
    'dictType': 'dataType',
    'pCode': '',
    'name': '数字'
  }, {
    'css': '',
    'code': 'text',
    'icon': '',
    'tips': '',
    'dictType': 'dataType',
    'pCode': '',
    'name': '字符串'
  }, { 'css': '', 'code': 'boolean', 'icon': '', 'tips': '', 'dictType': 'dataType', 'pCode': '', 'name': '布尔值' }],
  'module': [{
    'css': '',
    'code': 'sys',
    'icon': '',
    'tips': '',
    'dictType': 'module',
    'pCode': '',
    'name': 'sys'
  }, {
    'css': '',
    'code': 'business',
    'icon': '',
    'tips': '',
    'dictType': 'module',
    'pCode': '',
    'name': 'business'
  }, {
    'css': '',
    'code': 'sample',
    'icon': '',
    'tips': '',
    'dictType': 'module',
    'pCode': '',
    'name': 'sample'
  }, {
    'css': '',
    'code': 'import',
    'icon': '',
    'tips': '',
    'dictType': 'module',
    'pCode': '',
    'name': 'import'
  }, {
    'css': '',
    'code': 'scheduler',
    'icon': '',
    'tips': '',
    'dictType': 'module',
    'pCode': '',
    'name': 'scheduler'
  }],
  'sex': [{ 'css': '', 'code': '1', 'icon': '', 'tips': '', 'dictType': 'sex', 'pCode': '', 'name': '男' }, {
    'css': '',
    'code': '2',
    'icon': '',
    'tips': '',
    'dictType': 'sex',
    'pCode': '',
    'name': '女'
  }],
  'roleStatus': [{
    'css': 'green',
    'code': '1',
    'icon': '',
    'tips': '',
    'dictType': 'roleStatus',
    'pCode': '',
    'name': '启用'
  }, { 'css': 'red', 'code': '2', 'icon': '', 'tips': '', 'dictType': 'roleStatus', 'pCode': '', 'name': '禁用' }],
  'generatorTemplate': [{
    'css': '',
    'code': 'default',
    'icon': '',
    'tips': '',
    'dictType': 'generatorTemplate',
    'pCode': '',
    'name': '默认（增/删/改/查）'
  }, {
    'css': '',
    'code': 'defaultOnlySelect',
    'icon': '',
    'tips': '',
    'dictType': 'generatorTemplate',
    'pCode': '',
    'name': '默认（仅查询）'
  }, {
    'css': '',
    'code': 'bizAndDao',
    'icon': '',
    'tips': '',
    'dictType': 'generatorTemplate',
    'pCode': '',
    'name': '业务层+持久层'
  }, { 'css': '', 'code': 'dao', 'icon': '', 'tips': '', 'dictType': 'generatorTemplate', 'pCode': '', 'name': '持久层' }],
  'leaveType': [{
    'css': '',
    'code': '1',
    'icon': '',
    'tips': '',
    'dictType': 'leaveType',
    'pCode': '',
    'name': '年假'
  }, {
    'css': '',
    'code': '2',
    'icon': '',
    'tips': '',
    'dictType': 'leaveType',
    'pCode': '',
    'name': '事假'
  }, {
    'css': '',
    'code': '3',
    'icon': '',
    'tips': '',
    'dictType': 'leaveType',
    'pCode': '',
    'name': '病假'
  }, {
    'css': '',
    'code': '4',
    'icon': '',
    'tips': '',
    'dictType': 'leaveType',
    'pCode': '',
    'name': '调休'
  }, {
    'css': '',
    'code': '5',
    'icon': '',
    'tips': '',
    'dictType': 'leaveType',
    'pCode': '',
    'name': '产假'
  }, {
    'css': '',
    'code': '6',
    'icon': '',
    'tips': '',
    'dictType': 'leaveType',
    'pCode': '',
    'name': '陪产假'
  }, {
    'css': '',
    'code': '7',
    'icon': '',
    'tips': '',
    'dictType': 'leaveType',
    'pCode': '',
    'name': '婚假'
  }, {
    'css': '',
    'code': '8',
    'icon': '',
    'tips': '',
    'dictType': 'leaveType',
    'pCode': '',
    'name': '丧假'
  }, {
    'css': '',
    'code': '9',
    'icon': '',
    'tips': '',
    'dictType': 'leaveType',
    'pCode': '',
    'name': '产检假'
  }, { 'css': '', 'code': '10', 'icon': '', 'tips': '', 'dictType': 'leaveType', 'pCode': '', 'name': '特殊工伤假' }],
  'messageType': [{
    'css': 'blue',
    'code': 'notice',
    'icon': '',
    'tips': '',
    'dictType': 'messageType',
    'pCode': '',
    'name': '通知'
  }, {
    'css': 'orange',
    'code': 'event',
    'icon': '',
    'tips': '',
    'dictType': 'messageType',
    'pCode': '',
    'name': '事件'
  }, {
    'css': 'green',
    'code': 'journal',
    'icon': '',
    'tips': '',
    'dictType': 'messageType',
    'pCode': '',
    'name': '日志'
  }],
  'grid': [{ 'code': '12/2/10', 'dictType': 'grid', 'name': '12/2/10 一列' }, {
    'code': '6/4/8',
    'dictType': 'grid',
    'name': '6/4/8 两列'
  }, { 'code': '4/4/8', 'dictType': 'grid', 'name': '4/4/8 三列' }, {
    'code': '3/4/8',
    'dictType': 'grid',
    'name': '3/4/8 四列'
  }],
  'matchingMode': [{ 'code': 'eq', 'dictType': 'matchingMode', 'name': '=' }, {
    'css': '',
    'code': 'ne',
    'icon': '',
    'tips': '',
    'dictType': 'matchingMode',
    'pCode': '',
    'name': '!='
  }, { 'code': 'gt', 'dictType': 'matchingMode', 'name': '&gt;' }, {
    'code': 'gte',
    'dictType': 'matchingMode',
    'name': '&gt;='
  }, { 'code': 'lt', 'dictType': 'matchingMode', 'name': '&lt;' }, {
    'code': 'lte',
    'dictType': 'matchingMode',
    'name': '&lt;='
  }, { 'code': 'like', 'dictType': 'matchingMode', 'name': 'like' }, {
    'code': 'left_like',
    'dictType': 'matchingMode',
    'name': '左 like'
  }, { 'code': 'right_like', 'dictType': 'matchingMode', 'name': '右 like' }],
  'commonStatus': [{
    'css': 'green',
    'code': '1',
    'icon': '',
    'tips': '',
    'dictType': 'commonStatus',
    'pCode': '',
    'name': '启用'
  }, { 'css': 'red', 'code': '2', 'icon': '', 'tips': '', 'dictType': 'commonStatus', 'pCode': '', 'name': '禁用' }],
  'permissionsType': [{
    'css': '',
    'code': '1',
    'icon': '',
    'tips': '',
    'dictType': 'permissionsType',
    'pCode': '',
    'name': '菜单'
  }, { 'css': '', 'code': '2', 'icon': '', 'tips': '', 'dictType': 'permissionsType', 'pCode': '', 'name': '权限' }],
  'activityType': [{
    'css': 'green',
    'code': 'startEvent',
    'icon': 'la la-circle-thin',
    'tips': '',
    'dictType': 'activityType',
    'pCode': '',
    'name': '流程发起'
  }, {
    'css': 'orange',
    'code': 'userTask',
    'icon': 'la la-user',
    'tips': '',
    'dictType': 'activityType',
    'pCode': '',
    'name': '用户审批'
  }, {
    'css': 'orange',
    'code': 'exclusiveGateway',
    'icon': 'la la-random',
    'tips': '',
    'dictType': 'activityType',
    'pCode': '',
    'name': '条件网关'
  }, {
    'css': 'blue',
    'code': 'endEvent',
    'icon': 'la la-circle',
    'tips': '',
    'dictType': 'activityType',
    'pCode': '',
    'name': '流程结束'
  }],
  'dataSource': [{
    'css': '',
    'code': 'master',
    'icon': '',
    'tips': 'easy-frame',
    'dictType': 'dataSource',
    'pCode': '',
    'name': '主库'
  }],
  'elementType': [{ 'code': 'text', 'dictType': 'elementType', 'name': '文本框' }, {
    'code': 'select',
    'dictType': 'elementType',
    'name': '单选下拉框'
  }, { 'code': 'select_multiple', 'dictType': 'elementType', 'name': '多选下拉框' }, {
    'code': 'hidden',
    'dictType': 'elementType',
    'name': '隐藏字段'
  }, { 'code': 'textarea', 'dictType': 'elementType', 'name': '文本域' }, {
    'code': 'radio',
    'dictType': 'elementType',
    'name': '单选框'
  }, { 'code': 'checkbox', 'dictType': 'elementType', 'name': '多选框' }, {
    'code': 'date',
    'dictType': 'elementType',
    'name': '日期'
  }, { 'code': 'datetime', 'dictType': 'elementType', 'name': '日期时间' }, {
    'code': 'password',
    'dictType': 'elementType',
    'name': '密码'
  }, { 'code': 'number', 'dictType': 'elementType', 'name': '数字' }],
  'taskStatus': [{
    'css': 'blue',
    'code': '1',
    'icon': '',
    'tips': '',
    'dictType': 'taskStatus',
    'pCode': '',
    'name': '办理中'
  }, {
    'css': 'orange',
    'code': '-1',
    'icon': '',
    'tips': '',
    'dictType': 'taskStatus',
    'pCode': '',
    'name': '已撤销'
  }, { 'css': 'green', 'code': '2', 'icon': '', 'tips': '', 'dictType': 'taskStatus', 'pCode': '', 'name': '已办结' }],
  'verification': [{ 'code': 'email', 'dictType': 'verification', 'name': '电子邮件' }, {
    'code': 'url',
    'dictType': 'verification',
    'name': '网址'
  }, { 'code': 'date', 'dictType': 'verification', 'name': '日期' }, {
    'code': 'dateISO',
    'dictType': 'verification',
    'name': '日期 (YYYY-MM-DD)'
  }, { 'code': 'number', 'dictType': 'verification', 'name': '数字' }]
}
