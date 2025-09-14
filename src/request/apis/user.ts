import { request } from "./../index";
import type {
  LoginApiParamType,
  RegisterApiParamsType,
  SmsApiParamsType,
  ResetParamsType,
  ISMatchParamsType,
  isMatchPhoneAndCodeParamsType
} from "./../../types/apiParamTypes";
import type {
  IsLoginExistReturnType,
  getPhoneByLoginIdReturnType,
  IsMatchReturnType,
  LoginReturnType,
  WhoamiReturnType
} from "./../../types/apiReturnTypes";
// 登陆
export const loginApi = async (data: LoginApiParamType) => {
  return await request.post<LoginReturnType>("/api/user/login", data);
};

// 用户获取自身信息
export const whoamiApi = async () => {
  return await request.get<WhoamiReturnType>("/api/user/whoami");
};

// 注册
export const registerApi = async (data: RegisterApiParamsType) => {
  return await request.post("/api/user/register", data);
};

// 获取推荐列表
export const getRecommendFirendApi = async () => {
  return await request.get("/api/user/recommendFirend");
};

// 上传头像
export const uploadAvatarApi = async () => {
  return await request.post("/api/upload");
};

// 上传多张图片
export const uploadMultipleApi = async () => {
  return await request.post("/api/upload/multiple");
};

// 查询用户名是否已被占用
export const isLoginIdExistApi = async (loginId: string) => {
  return await request.get<IsLoginExistReturnType>(
    `/api/user/isLoginIdExist?loginId=${loginId}`
  );
};

// 查询手机号码是否已被存在
export const isPhoneExistApi = async (mobile: string) => {
  return await request.get(`/api/user/isPhoneExist?mobile=${mobile}`);
};

// 根据用户名查询手机号
export const getPhoneByLoginIdApi = async (loginId: string) => {
  return await request.get<getPhoneByLoginIdReturnType>(
    `/api/user/getUserPhoneByLoginId?loginId=${loginId}`
  );
};

// 获取验证码
export const getSmsCodeApi = async (data: SmsApiParamsType) => {
  return await request.get(
    `http://localhost:5008/api/sms/getSmsCode?mobile=${data.mobile}&type=${data.type}`
  );
};

// 修改密码
export const resetApi = async (data: ResetParamsType) => {
  return await request.post("/api/user/resetPwd", data);
};

// 查询手机号和用户名是否匹配
export const isMatchApi = async(data:ISMatchParamsType)=>{
  return await request.get<IsMatchReturnType>(`/api/user/isMatch?loginId=${data.loginId}&mobile=${data.mobile}`)
}

//查询手机号和验证码是否匹配
export const isMatchPhoneAndCodeApi = async(data:isMatchPhoneAndCodeParamsType)=>{
  return await request.get(`/api/user/isMatchPhoneAndCode?mobile=${data.mobile}&code=${data.code}&type=${data.type}`)
}