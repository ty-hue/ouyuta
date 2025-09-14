import {LoginType,SmsCodeType} from './enums'
// 登陆请求参数类型
export interface LoginApiParamType {
  loginId?: string;
  loginPwd?: string;
  type: LoginType;
  code?:string
  mobile?:string
}

//注册请求参数类型
export interface RegisterApiParamsType {
  loginId: string;
  loginPwd: string;
  mobile: string;
  code: string;
}

//获取验证码接口参数类型
export interface SmsApiParamsType {
  mobile: string;
  type: SmsCodeType;
}

// 修改密码请求参数类型
export interface ResetParamsType {
  mobile: string;
  code: string;
  loginId: string;
  loginPwd: string;
}

// 根据查询用户名和手机号是否匹配参数类型
export interface ISMatchParamsType{
  mobile:string,
  loginId:string
}

// 查询验证码和手机号是否匹配
export interface isMatchPhoneAndCodeParamsType{
  mobile:string,
  code:string,
  type:SmsCodeType
}

