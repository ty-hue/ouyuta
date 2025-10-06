<template>
  <view class="export-music">
    <view class="export-nav">
      <cover-image
        @click="backChooseMusic"
        src="./../../../static/createIcons/export-back.png"
        class="export-nav-back"
      ></cover-image>
      <view class="export-nav-title">
        <text class="nav-title-text">导入音频</text>
      </view>
    </view>
    <view class="export-btn" @click="exportAudioFromLocal">
      <cover-image
        src="./../../../static/createIcons/export.png"
        class="btn-icon"
      ></cover-image>
      <text class="btn-text">提取视频中的音频</text>
    </view>
    <!-- #ifndef APP-NVUE -->
    <scroll-view
      scroll-y
      :style="{ height: '690rpx' }"
      @scrolltolower="loadMore"
      @refresherrefresh="refresh"
      :refresher-triggered="refreshing"
      :refresher-enabled="true"
      scroll-with-animation
      lower-threshold="10"
      :scroll-top="top"
      @scroll="handleScroll"
    >
      <view>
        <Music
          :data="it"
          :is-hidden-author="true"
          v-for="it in list"
          :key="it.id"
          @handle-active="handleActive"
          :current="current as number"
        />
        <view class="loading-box" v-if="loading && !noMore">
          <up-loading-icon mode="circle" size="30"></up-loading-icon>
        </view>
      </view>
    </scroll-view>
    <!-- #endif -->
    <!-- #ifdef APP-NVUE -->
    <list
      class="list"
      @loadmore="loadMore"
      loadmoreoffset="10"
      @scroll="onScroll"
      :scrollTop="-top"
    >
      <!-- 下拉刷新 -->
      <refresh @refresh="refresh" :display="refreshing ? 'show' : 'hide'">
        <view class="refresh-content">
          <view class="dot" v-for="it in 3"></view>
        </view>
      </refresh>

      <!-- 列表内容 -->
      <cell v-for="item in list" :key="item.id">
        <Music
          :data="item"
          :is-hidden-author="true"
          @handle-active="handleActive"
          :current="current as number"
        />
      </cell>
      <cell>
        <view class="loading-box" v-if="loading && !noMore && list.length > 0">
          <up-loading-icon mode="circle" size="30"></up-loading-icon>
        </view>
      </cell>
    </list>
    <!-- #endif -->
  </view>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, onUnmounted } from "vue";
import { getUserPrivateAudioList } from "@/request/apis/audio";
import type { AudioItemType } from "@/types/apiReturnTypes";
import Music from "./Music.vue";
import { getAudioFromVideo } from "@/request/apis/upload";
import type { ScrollViewOnScroll } from "@uni-helper/uni-app-types";
const emit = defineEmits(["closeExportMusic", "cacheExportAudioList"]);
import bus from "@/utils/bus";
defineExpose({
  getScrollTop: () => scrollTop.value,
});
const props = defineProps<{ top: number; exportAudioList: AudioItemType[] }>();
const scrollTop = ref(0);
const slideNum = ref(0);
const onScroll = (e: any) => {
  scrollTop.value = e.contentOffset.y;
  slideNum.value++;
};
const exportAudioFromLocal = () => {
  uni.chooseVideo({
    sourceType: ["album", "camera"], // 视频来源：相册、相机
    maxDuration: 60, // 最大拍摄时长（秒）
    camera: "back", // 默认相机：back（后置）、front（前置）
    success: async (res) => {
      // 选择/拍摄成功的回调
      try {
        await getAudioFromVideo(res.tempFilePath);
        await refresh();
      } catch (e) {
        console.log(e, "报错信息");
      }
    },
    fail: function (err) {
      // 失败回调
      console.log("选择视频失败：", err);
    },
  });
};
const backChooseMusic = () => {
  emit("closeExportMusic");
  bus.emit("clearAudio");
  bus.emit("getMuiscName", "");
};
const loading = ref(false);
const noMore = ref(false);
const paginationParams = reactive({
  page: 1,
  pageSize: 6,
});
const refreshing = ref(false);
let list = ref<AudioItemType[] | []>([]);
const refresh = async () => {
  bus.emit("clearAudio");

  refreshing.value = true;

  paginationParams.page = 1;
  list.value = [];
  noMore.value = false;
  loading.value = false;
  await loadData();
  refreshing.value = false;
};
const loadMore = async () => {
  if (loading.value || noMore.value) {
    return;
  }
  await loadData();
};
const loadData = async () => {
  loading.value = true;
  const res = await getUserPrivateAudioList(paginationParams);

  list.value = [...list.value!, ...res.data];
  loading.value = false;
  paginationParams.page++;
  if (list.value.length === res.total) {
    noMore.value = true;
  }
};
onMounted(() => {
  if (props.exportAudioList.length > 0) {
    list.value = props.exportAudioList;
  }
  if (props.exportAudioList.length === 0) {
    loadData();
  }
});
onUnmounted(() => {
  // #ifdef H5
  emit("cacheExportAudioList", list.value, scrollTop.value);
  // #endif
  // #ifdef APP-NVUE
  if (slideNum.value > 1) {
    emit("cacheExportAudioList", list.value, scrollTop.value);
  }
  // #endif
});
let current = ref<number | null>(null);
const handleActive = (id: number) => {
  current.value = id;
};
const handleScroll: ScrollViewOnScroll = (e) => {
  scrollTop.value = e.detail.scrollTop;
};
</script>

<style lang="scss" scoped>
.export-music {
  .export-nav {
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
    height: 40rpx;
    .export-nav-back {
      width: 40rpx;
      height: 40rpx;
      z-index: 1;
    }
    .export-nav-title {
      position: absolute;
      width: 690rpx;
      top: 0;
      left: 0;
      height: 40rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      .nav-title-text {
        font-size: 30rpx;
        color: #000;
        font-weight: 900;
      }
    }
  }
  .export-btn {
    margin: 20rpx 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 80rpx;
    background-color: #f3f3f5;
    border-radius: 40rpx;
    .btn-text {
      font-size: 30rpx;
      color: #000 !important;
      font-weight: 700;
      margin-left: 20rpx;
    }
    .btn-icon {
      width: 40rpx;
      height: 40rpx;
    }
  }
  .list {
    height: 690rpx;
    .refresh-content {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      .dot {
        width: 18rpx;
        height: 18rpx;
        border-radius: 50%;
        background-color: #ccc;
        margin: 0 4rpx;
      }
    }
    .loading-box {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      height: 80rpx;
    }
  }
}
</style>
