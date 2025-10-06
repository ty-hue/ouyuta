<template>
  <up-action-sheet :round="30" :show="show" @close="handleSheetClose">
    <view class="sheet-content" @tap="hideKeyboard">
      <!-- 顶部标记 -->
      <view class="pendant">
        <view class="content"></view>
      </view>
      <view
        class="music-all"
        :style="
          isShowExportAudio
            ? { opacity: 0, height: 0, overflow: 'hidden' }
            : { opacity: 1, height: '1000rpx' }
        "
      >
        <view class="input-container" @click="showSearchMusicSheet">
          <up-icon name="search" color="#b3b4b8" size="20"></up-icon>
          <text class="placeholder-text">搜索歌名/歌手</text>
        </view>
        <view class="music-market">
          <view class="tabs">
            <up-tabs
              :list="tabsList"
              @change="tabsChange"
              :current="current"
            ></up-tabs>
            <view class="export-video" @click="openExportAudio">
              <cover-image
                src="./../../static/createIcons/export-audio.png"
                class="export-icon"
              />
              <text class="export-text">导入音频</text>
            </view>
          </view>
          <view class="music-content">
            <swiper
              :style="{ height: '800rpx' }"
              class="content-swiper"
              :duration="500"
              :current="current"
              @change="swiperChange"
              @animationfinish="animationfinish"
            >
              <swiper-item v-for="swp_it in tabsList" :key="swp_it.id">
                <SwiperItemContent
                  ref="swpItemRefList"
                  :category-id="swp_it.id"
                  :swp-data="tabsList[swp_it.id]"
                  @cacheData="cacheData"
                />
              </swiper-item>
            </swiper>
          </view>
        </view>
      </view>

      <ExportMusic
        :export-audio-list="exportAudioList"
        :top="scrollTop"
        ref="exportRef"
        :style="
          isShowExportAudio
            ? { opacity: 1, height: '900rpx' }
            : { opacity: 0, height: 0, overflow: 'hidden' }
        "
        @closeExportMusic="closeExportMusic"
        @cacheExportAudioList="cacheExportAudioList"
      />
    </view>
  </up-action-sheet>
</template>

<script lang="ts" setup>
import SwiperItemContent from "./comp/SwiperItemContent.vue";
import bus from "@/utils/bus";
import { reactive, ref, watch, onUnmounted, onMounted } from "vue";
import type { SwiperOnAnimationfinish } from "@uni-helper/uni-app-types";
import ExportMusic from "./comp/ExportMusic.vue";
import type { AudioItemType, SwpContentData } from "@/types/apiReturnTypes";
const showSearchMusicSheet = () => {
  if (currentAudio.value) {
    pauseAudio();
  }
  bus.emit("openSearchMusicSheet");
};
const show = ref(false);
const hideKeyboard = () => {
  uni.hideKeyboard();
};

const openMusicSheet = async () => {
  show.value = true;
  if (currentAudio.value) {
    playAudio();
  }
};
let exportAudioList = ref<AudioItemType[]>([]);
// 缓存exportAudioList
const cacheExportAudioList = (list: AudioItemType[], top: number) => {
  exportAudioList.value = list;
  scrollTop.value = top;
};
const handleSheetClose = () => {
  show.value = false;
  hideKeyboard();
  if (currentAudio.value) {
    if (!audiuoStatus.value) {
      clearAudio();
    } else {
      pauseAudio();
    }
  }
};
bus.on("closeMusicSheet", handleSheetClose);
const scrollTop = ref(0);
const exportRef = ref<typeof ExportMusic | null>(null);
const swpItemRefList = ref<InstanceType<typeof SwiperItemContent>[]>([]);
// 标签栏数据
const tabsList = reactive<SwpContentData[]>([
  { id: 0, name: "推荐", list: [], scrollTop: 0 },
  { id: 1, name: "热门", list: [], scrollTop: 0 },
  { id: 2, name: "收藏", list: [], scrollTop: 0 },
  { id: 3, name: "用过", list: [], scrollTop: 0 },
]);

bus.on("openMusicSheet", openMusicSheet);
const current = ref(0);
const tabsChange = (e: any) => {
  current.value = e.index;
  console.log(swpItemRefList.value[current.value], "组件实例");
  if (!swpItemRefList.value[current.value].list.length) {
    swpItemRefList.value[current.value].loadMore();
  }
};
// #ifndef APP-NVUE
const animationfinish: SwiperOnAnimationfinish = (e) => {
  current.value = e.detail.current;
  if (!swpItemRefList.value[current.value].list.length) {
    swpItemRefList.value[current.value].loadMore();
  }
};
// #endif

// #ifdef APP-NVUE
const swiperChange = (e: any) => {
  current.value = e.detail.current;
  if (!swpItemRefList.value[current.value].list.length) {
    swpItemRefList.value[current.value].loadMore();
  }
};
// #endif
const isShowExportAudio = ref(false);
// 点击导入音频切换到导入音频组件
const openExportAudio = () => {
  isShowExportAudio.value = true;
  clearAudio();
};
const closeExportMusic = async () => {
  isShowExportAudio.value = false;
};
// 当前选中的音频的信息
let currentAudio = ref<AudioItemType | null>(null);
let innerAudioContext: UniApp.InnerAudioContext | null = null; // 音频上下文
const currentAudioHandler = (audio: AudioItemType) => {
  if (currentAudio.value) {
    if (currentAudio.value.id !== audio.id) {
      // 1. 清理上一个音频的数据
      clearAudio();
      // 2. 存储当前播放的音频对象
      currentAudio.value = audio;
      // 3. 生成当前音频对象对应的音频上下文
      createAudioCtx(audio);
    }
  } else {
    // 2. 存储当前播放的音频对象
    currentAudio.value = audio;
    // 3. 生成当前音频对象对应的音频上下文
    createAudioCtx(audio);
  }
};
bus.on("currentAudio", currentAudioHandler);
// 2. 定义播放结束的回调函数
const handleEnded = () => {
  bus.emit("setAudioIsPlaying", {
    audioId: currentAudio.value?.id!,
    value: false,
  });
};
// 创建一个音频上下文
const createAudioCtx = (audio: AudioItemType) => {
  // 创建内部音频上下文
  innerAudioContext = uni.createInnerAudioContext();
  // 设置音频源
  innerAudioContext.src = audio.audioUrl;
  // 监听音频上下文播放完成事件
  innerAudioContext.offEnded;
  // 绑定结束事件监听
  innerAudioContext.onEnded(handleEnded);
};
const playAudio = () => {
  innerAudioContext?.play();
  bus.emit("setAudioIsPlaying", {
    value: true,
    audioId: currentAudio.value!.id,
  });
  audiuoStatus.value = true;
};
let audiuoStatus = ref(false);
const pauseAudio = () => {
  innerAudioContext?.pause();
  bus.emit("setAudioIsPlaying", {
    value: false,
    audioId: currentAudio.value!.id,
  });
  audiuoStatus.value = false;
};
const seekAudio = () => {
  innerAudioContext?.seek(0);
};
const clearAudio = () => {
  if (currentAudio.value) {
    bus.emit("swiperContentCompChangeResetCurrent");
    bus.emit("setAudioIsPlaying", {
      value: false,
      audioId: currentAudio.value.id,
    });
    pauseAudio();
    currentAudio.value = null;
    innerAudioContext = null;
  }
};
bus.on("playAudio", playAudio);
bus.on("pauseAudio", pauseAudio);
bus.on("seekAudio", seekAudio);
bus.on("clearAudio", clearAudio);

//每次切换tab或swiperitem时，清除上一个swiperitem页面中audio状态
watch(current, () => {
  clearAudio();
});

onUnmounted(() => {
  bus.off("pauseAudio", pauseAudio);
  bus.off("playAudio", playAudio);
  bus.off("seekAudio", seekAudio);
  bus.off("clearAudio", clearAudio);
  bus.off("openMusicSheet", openMusicSheet);
  bus.off("closeMusicSheet", handleSheetClose);
  bus.off("currentAudio", currentAudioHandler);
  // #ifdef APP-NVUE || H5
  bus.off("checkActiveAudio", checkActiveAudio);
  // #endif
});
const cacheData = (
  id: number,
  scrollTop: number,
  data: AudioItemType[],
  slideNum: number
) => {
  tabsList[id].list = data;
  // #ifdef H5
  tabsList[id].scrollTop = scrollTop;
  // #endif
  // #ifdef APP-NVUE
  if (slideNum > 1) {
    tabsList[id].scrollTop = scrollTop;
  }
  // #endif
};

// #ifdef APP-NVUE || H5
// 调整处理函数的参数为对象结构（与Events类型匹配）
const checkActiveAudio = ({
  audioId,
  callback,
}: {
  audioId: number;
  callback: (result: boolean) => void;
}) => {
  if (currentAudio.value) {
    // 调用回调返回结果（注意这里用的是callback，与参数名保持一致）
    callback(audioId === currentAudio.value.id);
  } else {
    // 可以处理currentAudio不存在的情况
    callback(false);
  }
};

// 现在类型匹配了
bus.on("checkActiveAudio", checkActiveAudio);
// #endif

// SearchMusicSheet中点击使用音乐时专用     (重置current、修改推荐音乐列表数据、设置推荐音乐页第一个音乐未激活态)
const changeRecommendSwiperData = (audio: AudioItemType) => {
  current.value = 0;
  bus.emit("clearAudio");
  currentAudio.value = audio;
  swpItemRefList.value[current.value].changeRecommendSwiperData(audio);
};
bus.on("changeRecommendSwiperData", changeRecommendSwiperData);
</script>

<style lang="scss" scoped>
.sheet-content {
  position: relative;
  background-color: #fff;
  padding: 70rpx 30rpx 30rpx 30rpx;
  border-top-left-radius: 30rpx;
  border-top-right-radius: 30rpx;
  width: 750rpx;
  .pendant {
    position: absolute;
    top: 0;
    left: 0;
    width: 750rpx;
    height: 40rpx;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    .content {
      width: 90rpx;
      height: 10rpx;
      border-radius: 20rpx;
      background: #515151;
    }
  }
  .music-all {
    .input-container {
      width: 690rpx;
      height: 80rpx;
      background-color: #f1f1f2;
      padding: 20rpx;
      display: flex;
      flex-direction: row;
      align-items: center;
      border-radius: 20rpx;
      .placeholder-text {
        font-size: 28rpx;
        margin-left: 20rpx;
        color: #b3b4b8;
      }
    }
    .music-market {
      .tabs {
        width: 690rpx;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        .export-video {
          display: flex;
          flex-direction: row;
          align-items: center;
          .export-icon {
            width: 40rpx;
            height: 40rpx;
            margin-right: 4rpx;
          }
          .export-text {
            font-size: 30rpx;
            color: #000;
          }
        }
      }
      .music-content {
        width: 690rpx;
        height: 800rpx;
        .content-swiper {
          width: 690rpx;
          height: 800rpx;
        }
      }
    }
  }
}
</style>
