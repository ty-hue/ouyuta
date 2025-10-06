<template>
  <view class="history-container" v-if="historyRecords.length > 0">
    <view class="nav-bar">
      <text class="title">历史记录</text>
      <view class="btns">
        <view class="del-or-finish" v-if="!isShowTrashIcon">
          <text class="all-del" @click="delLocalHistoryRecords(true)"
            >全部删除</text
          >
          <text class="split">|</text>
          <text class="finish" @click="toggleIsShowTrashIcon(false)">完成</text>
        </view>
        <up-icon
          name="trash-fill"
          color="#8a8b91"
          size="20"
          v-else
          @click="toggleIsShowTrashIcon(true)"
        ></up-icon>
      </view>
    </view>

    <view
      class="record-space"
      :style="!isExpand ? { height: foldContainerHeight + 'rpx' } : {}"
    >
      <view class="record-content" id="record-content">
        <view
          class="record-item"
          id="record-item"
          v-for="(record, index) in historyRecords"
          :key="index"
        >
          <text class="record-item-text">{{ record }}</text>
          <up-icon
            :style="{ marginLeft: '20rpx' }"
            name="close"
            color="#7f7f83"
            size="10"
            v-if="!isShowTrashIcon"
            @click="delLocalHistoryRecords(false, index)"
          ></up-icon>
        </view>

        <!-- 展开按钮 -->
        <view
          class="up-icon"
          @click="handleClickUpIcon"
          v-if="isShowUp && !allHide"
        >
          <up-icon name="arrow-up" blod color="#50525a" size="14"></up-icon>
        </view>
      </view>

      <!-- 折叠按钮（只有需要时显示） -->
      <view
        class="flod-icon"
        v-if="isFlod && !allHide"
        @click="handleClickDownIcon"
      >
        <up-icon name="arrow-down" blod color="#50525a" size="14"></up-icon>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { HISTORY_SEARCH } from "@/const/sysConst";
import {
  getCurrentInstance,
  onMounted,
  reactive,
  ref,
  nextTick,
  computed,
  watch,
} from "vue";
import { pxToRpx } from "@/utils";

let recordItemHeight = ref(0);
let foldContainerHeight = ref(0); // 折叠容器高度
let totalHeight = ref(0); // 所有记录总高度

const historyRecords = ref<string[]>([]);
const isShowTrashIcon = ref(true);

// 从本地缓存中获取搜索记录
const getHistoryRecords = () => {
  const loaclData = uni.getStorageSync(HISTORY_SEARCH);
  if (loaclData) {
    historyRecords.value = JSON.parse(loaclData);
    console.log(historyRecords.value, "缓存数据");
  }
};
let isExpand = ref(false);

let isShowUp = computed(() => {
  return isExpand.value;
});
let isFlod = computed(() => {
  if (!isExpand.value && totalHeight.value > foldContainerHeight.value) {
    console.log(totalHeight.value, foldContainerHeight.value, "to : fo");

    return true;
  } else {
    return false;
  }
});
// 获取元素高度
onMounted(() => {
  getHistoryRecords();
  const instance = getCurrentInstance();
  const query = uni.createSelectorQuery().in(instance);

  nextTick(() => {
    // 获取单个 record-item 高度
    query
      .select("#record-item")
      .boundingClientRect((rect) => {
        if (!rect) return;
        recordItemHeight.value = pxToRpx((rect as UniApp.NodeInfo).height!);
        foldContainerHeight.value = recordItemHeight.value * 2 + 40;
      })
      .exec();

    // 获取整体内容高度
    query
      .select("#record-content")
      .boundingClientRect((rect) => {
        if (!rect) return;
        totalHeight.value = pxToRpx((rect as UniApp.NodeInfo).height!);
      })
      .exec();
  });
});

const handleClickUpIcon = () => {
  isExpand.value = false;
};
const handleClickDownIcon = () => {
  isExpand.value = true;
};

const toggleIsShowTrashIcon = (flag: boolean) => {
  isShowTrashIcon.value = !isShowTrashIcon.value;
  if (flag) {
    allHide.value = true;
    isExpand.value = true;
  } else {
    allHide.value = false;
    isExpand.value = false;
    nextTick(() => {
      const instance = getCurrentInstance();
      const query = uni.createSelectorQuery().in(instance);
      query
        .select("#record-content")
        .boundingClientRect((rect) => {
          if (!rect) return;
          totalHeight.value = pxToRpx((rect as UniApp.NodeInfo).height!);
          console.log(totalHeight.value, "高度");
        })
        .exec();
    });
  }
};

/**
 * 删除本地历史记录
 * @param isAllDel 是否全部删除
 * @param index 删除项索引
 */
const delLocalHistoryRecords = (isAllDel: boolean = false, index?: number) => {
  if (isAllDel) {
    historyRecords.value = [];
    uni.setStorageSync(HISTORY_SEARCH, JSON.stringify(historyRecords.value));
    isShowTrashIcon.value = true;
    allHide.value = false;
    return;
  } else {
    historyRecords.value.splice(index!, 1);
    uni.setStorageSync(HISTORY_SEARCH, JSON.stringify(historyRecords.value));
    if (historyRecords.value.length === 0) {
      isShowTrashIcon.value = true;
    }
  }
};
let allHide = ref(false);
</script>

<style lang="scss" scoped>
.history-container {
  width: 710rpx;
  padding: 20rpx 20rpx 10rpx 20rpx;
  .nav-bar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10rpx;
    .title {
      color: #2c2d37;
      font-size: 30rpx;
      font-weight: bold;
    }
    .btns {
      .del-or-finish {
        display: flex;
        flex-direction: row;
        align-items: center;
        .all-del {
          color: #8a8b91;
          font-size: 26rpx;
        }
        .split {
          color: #e6e6e8;
          font-size: 26rpx;
          margin: 0 20rpx;
        }
        .finish {
          color: #8a8b91;
          font-size: 26rpx;
        }
      }
    }
  }

  .record-space {
    width: 710rpx;
    position: relative;
    .flod-icon {
      position: absolute;
      right: 0;
      bottom: 12rpx;
      width: 46rpx;
      height: 46rpx;
      border-radius: 50%;
      background-color: #f4f4f4;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
    }
    .record-content {
      width: 710rpx;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      .record-item {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 10rpx 20rpx;
        background-color: #f4f4f4;
        border-radius: 20rpx;
        margin: 10rpx;
        .record-item-text {
          color: #50525a;
          font-size: 26rpx;
        }
      }
      .up-icon {
        width: 46rpx;
        height: 46rpx;
        border-radius: 50%;
        background-color: #f4f4f4;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        margin: 10rpx;
      }
    }
  }
}
</style>
