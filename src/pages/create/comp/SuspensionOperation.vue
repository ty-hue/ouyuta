<template>
  <view class="operation-container">
    <view class="mode" v-if="!isShow">
      <text
        @click="chooseMode(it.id)"
        :class="['mode-item', it.id === currentIndex ? 'mode-item-active' : '']"
        v-for="it in list"
        :key="it.id"
        >{{ it.name }}</text
      >
    </view>
    <view class="btn-with-photo">
      <view
        v-if="currentIndex === 0 && !isDoingTake"
        class="record-btn"
        @click="startTakePhoto"
      >
        <view class="inner"></view>
      </view>
      <view
        v-else-if="currentIndex === 1 && !isFinishRecordVideo"
        class="record-vedio"
        @click="startRecordVideo"
      >
        <view
          class="inner"
          :class="[isStartRecordVideo ? 'inner-active' : '']"
        ></view>
      </view>
      <view class="photo-box" v-if="!isShow">
        <view class="show-box">
          <i class="iconfont icon-tupianshixiao"></i>
        </view>
        <text class="show-text">相册</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import bus from "@/utils/bus";

import { computed, reactive, ref, watch } from "vue";
const currentIndex = ref(0);

const list = reactive([
  {
    id: 0,
    name: "照片",
  },
  { id: 1, name: "视频" },
]);
const chooseMode = (id: number) => {
  currentIndex.value = id;
  isStartRecordVideo.value = false;
  isDoingTake.value = false
};
const isStartRecordVideo = ref(false);

const isDoingTake = ref(false); // 是否点击了照相按钮

// 开始录制视频
const startRecordVideo = () => {
  isStartRecordVideo.value = !isStartRecordVideo.value;
};
// 开始照相
const startTakePhoto = () => {
  isDoingTake.value = true;
};
const isFinishRecordVideo = ref(false) // 是否已经结束视频录制
watch(isStartRecordVideo, (newVal) => {
  if (newVal) {
    bus.emit("isHide", true);
  } else {
    bus.emit("isHide", false);
  }
});
watch(isStartRecordVideo,(newVal,oldVal)=>{
  if(oldVal && !newVal){
    isFinishRecordVideo.value = true
    bus.emit('isShowBtns',false)
    bus.emit('isFinish',true)
  }
  if(newVal){
    bus.emit('isDoingRecord',true)
  }
})
const isShow = computed(() => {
  if (isDoingTake.value || isStartRecordVideo.value || isFinishRecordVideo.value) {
    return true;
  } else {
    return false;
  }
});
watch(isDoingTake,(newVal)=>{
  if(newVal){
    bus.emit('isShowBtns',false);
    bus.emit('isFinish',true)
  }else{
    bus.emit('isShowBtns',true)
  }
})

</script>

<style lang="scss" scoped>
.operation-container {
  width: 100vw;
  position: fixed;
  bottom: 200rpx;
  left: 0;
  z-index: 1000;
  .mode {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20rpx;
    .mode-item {
      font-size: 26rpx;
      font-weight: 700;
      margin-right: 30rpx;
      padding: 10rpx;
      border-radius: 18rpx;
      color: #fff;
      letter-spacing: 1rpx;
      font-weight: normal;
    }
    .mode-item-active {
      color: #000;
      font-weight: 900;
      background-color: #fff;
    }
  }
  .btn-with-photo {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    position: relative;
    padding: 0 60rpx;
    height: 100rpx;
    .photo-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      .show-box {
        .iconfont {
          font-size: 100rpx;
          color: #fff;
        }
      }
      .show-text {
        color: #fff;
        font-size: 24rpx;
        letter-spacing: 2rpx;
      }
    }

    .record-btn {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      border: 6rpx solid #fff;
      width: 100rpx;
      height: 100rpx;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      .inner {
        width: 88rpx;
        height: 88rpx;
        border-radius: 50%;
        background-color: #fff;
      }
    }
    .record-vedio {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      border: 6rpx solid #fff;
      width: 100rpx;
      height: 100rpx;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      .inner {
        width: 88rpx;
        height: 88rpx;
        border-radius: 44rpx;
        background-color: red;
        transition: all 1s;
      }
      .inner-active {
        width: 40rpx;
        height: 40rpx;
        border-radius: 10rpx;
      }
    }
  }
}
</style>
