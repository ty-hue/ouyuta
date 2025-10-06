import type { PublishVideoReturnType } from "@/types/apiReturnTypes";
import type {PublishVideo} from '@/types/apiParamTypes'
import { request } from "./../index";
// 发布视频接口
export const publishVideo = async (data:PublishVideo) => {
  return await request.post<PublishVideoReturnType>(
    "/api/upload/video",
    data
  );
};
