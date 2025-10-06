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

export interface AudioItemType {
  id: number;
  audioUrl: string;
  userId: number;
  status: boolean;
  name: string;
  duration: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  isCollected: boolean;
  user: {
    id: number;
    name: string | null;
    avatarUrl: string;
  };
}
export interface getUserPrivateAudioListReturnType {
  total: number;
  totalPages: number;
  page: number;
  pageSize: number;
  data: AudioItemType[];
}

export interface PublishVideoReturnType {
  id: number;
  videoUrl: string;
  audioId: number;
  updatedAt: string;
  createdAt: string;
}

export interface SwpContentData {
  id: number;
  name: string;
  list: AudioItemType[];
  scrollTop?: number;
}

