// 登陆方式枚举
export enum LoginType {
  PWD = "PWD",
  MOBILE = "MOBILE",
}
// 验证码类型枚举
export enum SmsCodeType {
  LOGIN = "LOGIN", // 登陆类型
  REGISTER = "REGISTER", // 注册类型
  RESET = "RESET", // 修改密码类型
}

// 系统权限名称
export enum SysPermissionNameType{
  CAMERA = '相机权限',
  MICROPHONE = '麦克风权限',
  READPHTOT = '读取相册权限',
  WIRTERPHTOT = '写入相册权限'
}