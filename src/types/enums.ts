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
export enum SysPermissionNameType {
  CAMERA = "相机权限",
  MICROPHONE = "麦克风权限",
  READPHTOT = "读取相册权限",
  WIRTERPHTOT = "写入相册权限",
}

// 闪光灯值
export enum FlashValueType {
  AUTO = "auto", // 自动
  ON = "on", // 开
  OFF = "off", // 关
}

// 录制视频按钮的状态
export enum RecordBtnStatusType {
  DEFAULT = 0, // 未开始录制
  RECORDING = 1, // 录制中
  DONE = 2, // 录制结束
}

// 搜素音乐sheet枚举
export enum SearchMusicType {
  FIRST = 0,
  SECOND = 1,
  THREE = 2,
  EXIT = -1,
}
