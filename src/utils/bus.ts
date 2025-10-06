// utils/bus.ts
import mitt from "mitt";
import type { Emitter } from "mitt";
import type { AudioItemType } from "@/types/apiReturnTypes";
export interface SetAudioIsPlayingParams {
  value: boolean;
  audioId: number;
}
type CheckActiveAudioCallback = (result: boolean) => void;
// 定义所有事件的类型（事件名：参数类型）
type Events = {
  openSettingSheet: void;
  openMusicSheet: void;
  closeMusicSheet:void;
  currentAudio: AudioItemType;
  playAudio: void;
  pauseAudio: void;
  seekAudio: void;
  clearAudio: void;
  setAudioIsPlaying: SetAudioIsPlayingParams;
  swiperContentCompChangeResetCurrent: void;
  loadMore: number;
  checkActiveAudio: {
    audioId: number;
    callback: CheckActiveAudioCallback; // 通过回调传递返回值
  };
  updateCollectStatus: {
    audioId: number;
    status: boolean;
    categoryId: number;
  };
  updateCollectList: AudioItemType;
  openSearchMusicSheet: void;
  getMuiscName: string;
  changeRecommendSwiperData: AudioItemType;
  closeSearchMusicSheet:void
};

// 创建带类型的事件总线实例
const bus: Emitter<Events> = mitt<Events>();

export default bus;
