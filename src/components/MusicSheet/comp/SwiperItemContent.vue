<template>
  <view class="swiper-item">
    <!-- #ifndef APP-NVUE -->
    <scroll-view
      scroll-y
      :style="{ height: '800rpx' }"
      @scrolltolower="loadMore"
      @refresherrefresh="refresh"
      :refresher-triggered="refreshing"
      :refresher-enabled="true"
      scroll-with-animation
      lower-threshold="10"
      :show-scrollbar="false"
      @scroll="handleScroll"
      :scrollTop="swpData.scrollTop"
    >
      <view>
        <Music
          :data="it"
          v-for="it in list"
          :key="it.id"
          @handle-active="handleActive"
          :current="current as number"
          :category-id="categoryId"
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
      :scrollTop="-swpData.scrollTop!"
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
          @handle-active="handleActive"
          :current="current as number"
          :category-id="categoryId"
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
import {
  onBeforeUpdate,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  nextTick,
  watch,
} from "vue";
import type { AudioItemType } from "@/types/apiReturnTypes";
import { getAudioListByCategoryId } from "@/request/apis/audio";
import bus from "@/utils/bus";
import type { SwpContentData } from "@/types/apiReturnTypes";
import type { ScrollViewOnScroll } from "@uni-helper/uni-app-types";
import Music from "./Music.vue";
const props = defineProps<{
  categoryId: number;
  swpData: SwpContentData;
}>();
// 分页参数
const paginationParams = reactive({
  page: 1,
  pageSize: 6,
  categoryId: props.categoryId,
});
const loading = ref(false);
const noMore = ref(false);
const refreshing = ref(false);
let list = ref<AudioItemType[]>([]);
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
let current = ref<number | null>(null);

const handleActive = (id: number) => {
  current.value = id;
};

// 获取数据的方法
const loadData = async () => {
  loading.value = true;
  const res = await getAudioListByCategoryId(paginationParams);
  list.value = [...list.value!, ...res.data];
  console.log(list.value, "list");

  loading.value = false;
  paginationParams.page++;
  if (list.value.length === res.total) {
    noMore.value = true;
  }
};
// 当用户使用搜索音乐页的音乐时（专用）
const changeRecommendSwiperData = (audio: AudioItemType) => {
  list.value = list.value.filter((it) => {
    return it.id !== audio.id;
  });

  list.value.unshift(audio);

  bus.emit("setAudioIsPlaying", {
    value: true,
    audioId: audio.id,
  });
};
defineExpose({
  loadMore,
  list,
  getScrollTop: () => tempScrollTop.value,
  changeList: (data: AudioItemType[]) => (list.value = data),
  changeRecommendSwiperData,
  refresh,
});
const emit = defineEmits(["cacheData"]);
const updateCollectList = (audio: AudioItemType) => {
  if (audio.isCollected) {
    // 新增
    (list.value as AudioItemType[]).unshift(audio);
  } else {
    list.value = list.value.filter((it) => it.id !== audio.id);
  }
};
onMounted(() => {
  if (props.categoryId === 2) {
    bus.on("updateCollectList", updateCollectList);
  }
  bus.on("updateCollectStatus", handleUpdateCollect);
  if (
    (props.categoryId === 0 || props.categoryId === 2) &&
    props.swpData.list.length === 0
  ) {
    loadMore();
  }
  if (props.swpData.list.length > 0) {
    list.value = props.swpData.list;
  }
});
const swiperContentCompChangeResetCurrent = () => {
  current.value = null;
};
bus.on(
  "swiperContentCompChangeResetCurrent",
  swiperContentCompChangeResetCurrent
);

onUnmounted(() => {
  // 缓存数据
  // #ifdef H5
  emit("cacheData", props.categoryId, tempScrollTop.value, list.value);
  // #endif
  // #ifdef APP-NVUE
  if (props.categoryId !== 2) {
    emit(
      "cacheData",
      props.categoryId,
      tempScrollTop.value,
      list.value,
      slideNum.value
    );
  }
  // #endif
  bus.off(
    "swiperContentCompChangeResetCurrent",
    swiperContentCompChangeResetCurrent
  );
  bus.off("updateCollectStatus", handleUpdateCollect);
  if (props.categoryId === 2) {
    bus.off("updateCollectList", updateCollectList);
  }
});

// 记录滚动条位置
let tempScrollTop = ref(0);
// #ifndef APP-NVUE
const handleScroll: ScrollViewOnScroll = (e) => {
  tempScrollTop.value = e.detail.scrollTop;
};
// #endif
// #ifdef APP-NVUE
let slideNum = ref(0); // 记录滑动次数
const onScroll = (e: any) => {
  tempScrollTop.value = e.contentOffset.y;
  slideNum.value++;
};
// #endif
// ✅ 监听收藏状态变化
const handleUpdateCollect = ({
  audioId,
  status,
  categoryId,
}: {
  audioId: number;
  status: boolean;
  categoryId: number;
}) => {
  if (props.categoryId === 2 && categoryId === 2) {
    if (!status) {
      list.value = list.value.filter((it) => it.id !== audioId);
      bus.emit("clearAudio");
    }
  } else {
    list.value.forEach((item) => {
      if (item.id === audioId) {
        item.isCollected = status; // 直接改属性，响应式能追踪
      }
    });
  }
};
</script>

<style lang="scss" scoped>
.swiper-item {
  width: 690rpx;
  height: 800rpx;
}
</style>
