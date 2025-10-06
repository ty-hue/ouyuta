<template>
  <view class="ranking-container">
    <up-sticky>
      <view class="tabs">
        <up-tabs
          @change="handleTabsChange"
          :list="tabList"
          :current="current"
          lineColor="transparent"
          :activeStyle="{
            color: '#fe6c4a',
            fontSize: '44rpx',
            fontWeight: '900',
          }"
          :inactiveStyle="{ color: '#85858b', fontSize: '36rpx' }"
        ></up-tabs>
      </view>
    </up-sticky>

    <view class="swp-box">
      <swiper
        :style="{ height: musicListTotalHeight + 'rpx' }"
        :current="current"
        :duration="500"
        @change="swiperChange"
      >
        <swiper-item v-for="swp_it in tabList" :key="swp_it.id">
          <Music
            @handleActive="handleActive"
            :current="currentAudioId"
            v-for="(music, idx) in swp_it.list"
            :key="music.id"
            :data="music"
            :order="idx + 1"
          />
        </swiper-item>
      </swiper>
      <view class="noMore">
        <text class="noMore-tip">暂时没有更多了</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import Music from "./Music.vue";
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import type { AudioItemType, SwpContentData } from "@/types/apiReturnTypes";
import { getAudioListByCategoryId } from "@/request/apis/audio";
const props = withDefaults(
  defineProps<{
    rankCacheList: SwpContentData[];
  }>(),
  { rankCacheList: () => [] }
);
const emit = defineEmits(["sendCacheData"]);
const tabList = ref<SwpContentData[]>([
  { id: 0, name: "热歌榜", list: [] },
  { id: 1, name: "飙升榜", list: [] },
]);
const current = ref(0);
const handleTabsChange = async (e: any) => {
  current.value = e.index;
  if (tabList.value[current.value].list.length === 0) {
    await getAudioList(current.value);
  }
};
const swiperChange = async (e: any) => {
  current.value = e.detail.current;
  if (tabList.value[current.value].list.length === 0) {
    await getAudioList(current.value);
  }
};
const pageParams = reactive({
  page: 1,
  pageSize: 50,
});
const getAudioList = async (flag: number) => {
  const res = await getAudioListByCategoryId({
    ...pageParams,
    categoryId: flag,
  });
  tabList.value[flag].list = res.data;
};
onMounted(() => {
  if (props.rankCacheList.length > 0) {
    tabList.value = props.rankCacheList;
    return;
  }
  getAudioList(current.value);
});
onUnmounted(() => {
  emit("sendCacheData", tabList.value);
});
let musicListTotalHeight = computed(() => {
  return pageParams.pageSize * 140;
});

let currentAudioId = ref<number>(-1);

const handleActive = (current: number) => {
  currentAudioId.value = current;
};
</script>

<style lang="scss" scoped>
.ranking-container {
  width: 710rpx;

  .tabs {
    width: 710rpx;
    padding: 0 20rpx 0 20rpx;
    margin-bottom: 10rpx;
    background: #fff;
  }
  .swp-box {
    width: 710rpx;
    padding: 0 20rpx;
    .noMore {
      height: 80rpx;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      .noMore-tip {
        color: #7a7b82;
        font-size: 28rpx;
      }
    }
  }
}
</style>
