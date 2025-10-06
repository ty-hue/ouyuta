import { request } from "./../index";
import type {
  PaginationParamsType,
  GetAudioListByCategoryIdParams,
  CollectAudioParams,
  suggestAudioParams,
} from "@/types/apiParamTypes";
import type {
  getUserPrivateAudioListReturnType,
  AudioItemType,
} from "@/types/apiReturnTypes";

// 分页获取某个用户导入的音频列表
export const getUserPrivateAudioList = async (data: PaginationParamsType) => {
  return await request.get<getUserPrivateAudioListReturnType>(
    `/api/audio/getUserPrivateAudioList?page=${data.page}&pageSize=${data.pageSize}`
  );
};

// 根据分类id 分页获取音频列表
export const getAudioListByCategoryId = async (
  data: GetAudioListByCategoryIdParams
) => {
  return await request.get<getUserPrivateAudioListReturnType>(
    `/api/audio/getAudioListByCategoryId?page=${data.page}&pageSize=${data.pageSize}&categoryId=${data.categoryId}`
  );
};

// 收藏/ 取消收藏音频
export const collectAudio = async (data: CollectAudioParams) => {
  return await request.put<AudioItemType>("/api/audio/collectAudio", data);
};

// 获取提示词 搜索音乐
export const suggestAudio = async (data: suggestAudioParams) => {
  return await request.get<getUserPrivateAudioListReturnType>(
    `/api/audio/suggestAudio?keyword=${data.keyword}&page=${data.page}&pageSize=${data.pageSize}`
  );
};
