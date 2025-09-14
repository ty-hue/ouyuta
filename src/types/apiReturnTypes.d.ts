// 判断用户名是否已被占用接口返回值类型
export interface IsLoginExistReturnType {
  isExist: boolean;
}

// 根据用户名查询手机号返回值类型
export interface getPhoneByLoginIdReturnType {
  id: number;
  mobile: string;
}

export interface IsMatchReturnType {
  isMatch: boolean;
}

export interface LoginReturnType {
  token: string;
}

export interface WhoamiReturnType {
  name: string;
  age: number;
  mobile: string;
  sex: boolean;
  avatarUrl: string;
}
