/**
 * 系统参数 key
 */
export const SYS_CONFIG_KEY = {
  /**
   * 清理多少天前异常日志 单位: 天
   */
  CLEAN_EXCEPTION_LOG: 'cleanExceptionLog',
  /**
   * 清理多少天前访问日志 单位: 天
   */
  CLEAN_SYS_LOG: 'cleanSysLog',
  /**
   * 新增用户时的默认密码
   */
  DEFAULT_PASSWORD: 'defaultPassword',
  /**
   * 登录时密码错误尝试次数，超过后会被账号会被锁定
   */
  LOGIN_ATTEMPTS: 'loginAttempts',
  /**
   * 登录失败累计多少次后需要输入验证码后才可以登录
   */
  LOGIN_ATTEMPTS_VERIFICATION_CODE: 'loginAttemptsVerificationCode',
  /**
   * 尝试登录次数过多账号锁定时长 单位：秒
   */
  LOGIN_LOCK_LENGTH: 'loginLockLength',
  /**
   * 是否允许多地登录
   */
  LOGIN_MULTIPOINT: 'loginMultipoint',
  /**
   * 是否开启验证码
   */
  LOGIN_VERIFICATION_CODE: 'loginVerificationCode',
  /**
   * 新消息检查间隔时长 单位：秒
   */
  MESSAGE_CHECK_INTERVAL: 'messageCheckInterval',
  /**
   * 是否开启用户注册
   */
  OPEN_REGISTRATION: 'openRegistration',
  /**
   * 修改密码时密码的等级要求，分为0~5级，默认为3级
   */
  PASSWORD_SECURITY_LEVEL: 'passwordSecurityLevel',
  /**
   * 系统名称
   */
  PROJECT_NAME: 'projectName',
  /**
   * session失效时间 单位：秒
   */
  SESSION_INVALIDATE_TIME: 'sessionInvalidateTime'

}
