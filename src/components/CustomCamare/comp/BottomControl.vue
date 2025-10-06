<template>
  <view class="operation-container">
    <view class="mode">
      <text
        @click="chooseMode(it.id)"
        :class="['mode-item', it.id === currentIndex ? 'mode-item-active' : '']"
        v-for="it in list"
        :key="it.id"
        >{{ it.name }}</text
      >
    </view>
    <view class="btn-with-photo">
      <view class="btn-container">
        <view
          v-if="currentIndex === 0"
          class="record-btn"
          @click="startTakePhoto"
        >
          <view class="inner"></view>
        </view>
        <view
          v-if="currentIndex === 1"
          class="record-vedio"
          @click="startRecordVideo"
        >
          <view class="inner"></view>
        </view>
      </view>
      <view class="photo-box" >
        <view class="show-box">
          <cover-image
            src="./../../../static/createIcons/pc-failure.png"
            class="icon"
          ></cover-image>
        </view>
        <text class="show-box-text">相册</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import bus from "@/utils/bus";

import { computed, reactive, ref, watch } from "vue";
import {RecordBtnStatusType} from '@/types/enums'
const emit = defineEmits([
  "captureImage",
  "startVideoCapture",
  "stopVideoCapture",
]);
const currentIndex = ref(0);

const list = reactive([
  {
    id: 0,
    name: "照片",
  },
  { id: 1, name: "视频" },
]);
// 选择拍照 or
const chooseMode = (id: number) => {
  currentIndex.value = id;
};
const recordBtnStatus = ref<RecordBtnStatusType>(RecordBtnStatusType.DEFAULT)
// 开始录制视频
const startRecordVideo = () => {
	if(recordBtnStatus.value === RecordBtnStatusType.DEFAULT){
		emit("startVideoCapture");
		recordBtnStatus.value = RecordBtnStatusType.RECORDING
	}else if(recordBtnStatus.value === RecordBtnStatusType.RECORDING){
	   emit('stopVideoCapture');
	   recordBtnStatus.value = RecordBtnStatusType.DONE;
	}};
// 开始照相
const startTakePhoto = () => {
  emit("captureImage");
};
const isFinishRecordVideo = ref(false); // 是否已经结束视频录制
</script>

<style lang="scss" scoped>
.operation-container {
  width: 750rpx;
  position: absolute;
  bottom: 60rpx;
  left: 0;
  .mode {
    width: 750rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    margin-bottom: 40rpx;
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
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    position: relative;
    padding: 0 60rpx;
    height: 160rpx;
    .photo-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      .show-box {
        .icon {
          width: 100rpx;
          height: 100rpx;
        }
      }
      .show-box-text {
        color: #fff;
        font-weight: 900;
        font-size: 30rpx;
      }
    }

    .btn-container {
      position: absolute;
      left: 0;
      width: 750rpx;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      .record-btn {
        border: 6rpx solid #fff;
        width: 110rpx;
        height: 110rpx;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: row;
        .inner {
          width: 88rpx;
          height: 88rpx;
          border-radius: 50%;
          background-color: #fff;
        }
      }
      .record-vedio {
        border: 6rpx solid #fff;
        width: 110rpx;
        height: 110rpx;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: row;
        .inner {
          width: 88rpx;
          height: 88rpx;
          border-radius: 44rpx;
          background-color: red;
          // transition: all 1s;
        }
        .inner-active {
          width: 40rpx;
          height: 40rpx;
          border-radius: 10rpx;
        }
      }
    }
  }
}
</style>
