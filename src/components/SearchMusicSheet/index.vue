<template>
  <up-action-sheet :round="30" :show="show" @close="handleSheetClose">
    <view class="sheet-content">
      <!-- 顶部标记 -->
      <view class="pendant">
        <view class="content"></view>
      </view>

      <view class="nav-bar">
        <up-icon
          name="arrow-left"
          color="#1e202a"
          size="20"
          @click="goback"
        ></up-icon>
        <view class="input-container">
          <up-input
            v-model="keyword"
            @change="inputChangeDebounced"
            placeholder="wiz khalifa"
            prefixIcon="search"
            prefixIconStyle="font-size: 22px;color: #b3b4b8"
            customStyle="border:none;backgroundColor:#f1f1f2;"
            autoBlur
            color="#8d8e94"
            cursorColor="#fe2c55"
            clearable
            @focus="focus"
            @confirm="confirm"
            ref="inputRef"
          ></up-input>
        </view>
      </view>
      <SearchTipList
        v-if="flag === SearchMusicType.SECOND"
        :list="suggestList"
        :tip-height="80"
        @handle-click-arrow="handleClickArrow"
        @handle-click-search-icon="handleClickSearchIcon"
        :custom-style="{
          paddingTop: '40rpx',
          height: sheetHeight - 180 + 'rpx',
          paddingLeft: '60rpx',
          paddingRight: '60rpx',
        }"
        :text-style="{}"
      />
      <scroll-view
        v-if="flag === SearchMusicType.FIRST"
        scroll-y
        :style="{ height: sheetHeight - 180 + 'rpx' }"
      >
        <view class="history">
          <SearchHistory />
        </view>
        <view class="rank">
          <RankingList
            @sendCacheData="sendCacheData"
            :rankCacheList="rankCacheList"
          />
        </view>
      </scroll-view>

      <SearchResult
        v-if="flag === SearchMusicType.THREE"
        ref="searchResultRef"
        :total-height="sheetHeight - 180"
        :keyword="keyword"
      />
    </view>
  </up-action-sheet>
</template>

<script lang="ts" setup>
import { SearchMusicType } from "@/types/enums";
import bus from "@/utils/bus";
import { ref, onUnmounted, reactive, watch } from "vue";
import { pxToRpx } from "@/utils";
import RankingList from "./comp/RankingList.vue";
import SearchHistory from "./comp/SearchHistory.vue";
import SearchTipList from "@/components/SearchTipList/index.vue";
import { debounce } from "@/utils/index";
import { suggestAudio } from "@/request/apis/audio";
import type { AudioItemType, SwpContentData } from "@/types/apiReturnTypes";
import SearchResult from "./comp/SearchResult.vue";
const sheetHeight = ref(
  pxToRpx(
    uni.getSystemInfoSync().screenHeight -
      uni.getSystemInfoSync().statusBarHeight!
  )
);
const goback = () => {
  if (flag.value === SearchMusicType.FIRST) {
    show.value = false;
    return;
  }
  if (flag.value === SearchMusicType.SECOND) {
    flag.value = backUrl.value;
    return;
  }
  if (flag.value === SearchMusicType.THREE) {
    flag.value = SearchMusicType.FIRST;
    return;
  }
};
const show = ref(false);
const handleSheetClose = () => {
  show.value = false;
  uni.hideKeyboard();
};

const openSearchMusicSheet = () => {
  show.value = true;
};
const closeSearchMusicSheet = () => {
  show.value = false;
};
bus.on("openSearchMusicSheet", openSearchMusicSheet);
bus.on("closeSearchMusicSheet", closeSearchMusicSheet);
onUnmounted(() => {
  bus.off("openSearchMusicSheet", openSearchMusicSheet);
  bus.off("closeSearchMusicSheet", closeSearchMusicSheet);
});

let suggestList = ref<AudioItemType[]>([]);

// 获取提示词请求方法
const getSuggestAudioList = async (value: string) => {
  const res = await suggestAudio({
    keyword: value,
    page: 1,
    pageSize: 12,
  });
  suggestList.value = res.data;
};

// ✅ 这里创建一个防抖版本的函数，只生成一次
const inputChangeDebounced = debounce((value: string) => {
  if (!value) {
    suggestList.value = [];
    return;
  }
  keyword.value = value;
  getSuggestAudioList(value);
}, 500);
let keyword = ref("");
const handleClickArrow = async (tip: AudioItemType) => {
  keyword.value = tip.name;
  await getSuggestAudioList(keyword.value);
};
const handleClickSearchIcon = async (tip: AudioItemType) => {
  keyword.value = tip.name;
  flag.value = SearchMusicType.THREE;
};
let searchResultRef = ref<InstanceType<typeof SearchResult> | null>(null);

const flag = ref<SearchMusicType>(SearchMusicType.FIRST);
const focus = async () => {
  flag.value = SearchMusicType.SECOND;
};
const backUrl = ref<SearchMusicType>(SearchMusicType.FIRST); // 处于Second页时，返回按钮的url
watch(flag, (newVal, oldVal) => {
  backUrl.value = oldVal;
  console.log(backUrl.value, "backurl");

  if (newVal !== SearchMusicType.SECOND) {
    inputRef.value.doBlur();
  }
});
const inputRef = ref<any>(null);
const confirm = () => {
  flag.value = SearchMusicType.THREE;
};
const rankCacheList = ref<SwpContentData[]>([]);
const sendCacheData = (data: SwpContentData[]) => {
  rankCacheList.value = data;
};
</script>

<style scoped lang="scss">
.sheet-content {
  position: relative;
  background-color: #fff;
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
  .nav-bar {
    padding: 70rpx 20rpx 0rpx 20rpx;
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 710rpx;
    .input-container {
      flex: 1;
      margin-left: 20rpx;
    }
  }
}
</style>
