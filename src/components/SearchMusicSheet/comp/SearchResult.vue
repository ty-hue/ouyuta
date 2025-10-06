<template>
  <view class="result-container" :style="{ height: totalHeight + 'rpx' }">
    <view class="content" :style="{ height: totalHeight - 30 + 'rpx' }">
      <list class="list" @loadmore="loadMore" loadmoreoffset="10">
        <!-- 列表内容 -->
        <cell v-for="music in list" :key="music.id">
          <Music
            :data="music"
            @handle-active="handleActive"
            :current="currentAudioId"
          />
        </cell>
        <cell>
          <view
            class="loading-box"
            v-if="loading && !noMore && list.length > 0"
          >
            <up-loading-icon mode="circle" size="30"></up-loading-icon>
          </view>
        </cell>
      </list>
      <view
        v-if="isShowLoadingAnmition"
        :style="{ height: totalHeight - 30 + 'rpx' }"
        class="loading"
      >
        <up-loading-icon mode="circle"></up-loading-icon>
      </view>
      <view
        class="empty"
        v-if="isShowEmpty"
        :style="{ height: totalHeight - 30 + 'rpx' }"
      >
        <cover-image
          src="./../../../static/empty.png"
          class="empty-icon"
        ></cover-image>
        <text class="empty-text">抱歉，未查询到相关音乐</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import Music from "./Music.vue";
import type { AudioItemType } from "@/types/apiReturnTypes";
import { suggestAudio } from "@/request/apis/audio";
import { HISTORY_SEARCH } from "@/const/sysConst";

const props = withDefaults(
  defineProps<{
    totalHeight: number;
    keyword: string;
  }>(),
  {}
);
// 分页参数
const paginationParams = reactive({
  page: 1,
  pageSize: 9,
  keyword: props.keyword,
});
const loading = ref(false);
const noMore = ref(false);
const list = ref<AudioItemType[]>([]);
const loadMore = async () => {
  if (loading.value || noMore.value) {
    return;
  }
  await loadData();
};
// 获取数据的方法
const loadData = async () => {
  try {
    isShowLoadingAnmition.value = true;
    loading.value = true;
    const res = await suggestAudio(paginationParams);
    list.value = [...list.value!, ...res.data];
    loading.value = false;
    paginationParams.page++;
    if (list.value.length === res.total) {
      noMore.value = true;
    }
    isShowLoadingAnmition.value = false;
  } catch (e) {
    isShowLoadingAnmition.value = false;
  }
};
defineExpose({
  loadMore,
});
// 往本地历史搜索记录中添加一条数据
const addHistoryRecord = (value: string) => {
  const localData = uni.getStorageSync(HISTORY_SEARCH)
    ? JSON.parse(uni.getStorageSync(HISTORY_SEARCH))
    : [];
  const index = localData.indexOf(value);
  if (index !== -1) {
    localData.splice(index, 1);
  }
  localData.unshift(value);
  if (localData.length > 10) {
    localData.length = 10;
  }
  uni.setStorageSync(HISTORY_SEARCH, JSON.stringify(localData));
};
onMounted(async () => {
  if (!props.keyword) {
    return;
  }
  addHistoryRecord(props.keyword);
  await loadMore();
  if (list.value.length === 0) {
    isShowEmpty.value = true;
  }
});
let isShowEmpty = ref(false);
let isShowLoadingAnmition = ref(false);
let currentAudioId = ref<number>(-1);

const handleActive = (current: number) => {
  currentAudioId.value = current;
};
</script>

<style lang="scss" scoped>
.result-container {
  .content {
    padding-top: 30rpx;
    padding-left: 20rpx;
    padding-right: 20rpx;
    width: 710rpx;
    height: 600rpx;
    .loading {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
    }
    .empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .empty-icon {
        width: 300rpx;
        height: 300rpx;
      }
      .empty-text {
        font-size: 30rpx;
        color: #7a7b82;
      }
    }
  }
}
</style>
