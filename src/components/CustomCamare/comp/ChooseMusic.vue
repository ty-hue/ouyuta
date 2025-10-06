<template>
  <view class="choose-music">
    <view
      class="music-default-btn"
      @click="handleClick"
      v-if="isShowDefaultMode"
    >
      <cover-image
        src="./../../../static/createIcons/music.png"
        class="icon"
      ></cover-image>
      <text class="default-text">选择音乐</text>
    </view>
    <view class="music-btn" v-else>
      <view class="sing" @click="handleClick">
        <cover-image
          src="./../../../static/createIcons/music.png"
          class="icon"
        ></cover-image>
        <view class="sing-text" v-if="isScroll">
          <u-notice-bar
            :text="musicName"
            bgColor="transparent"
            :icon="false"
            color="#fff"
            :speed="50"
            fontSize="26rpx"
            :duration="500"
          ></u-notice-bar>
        </view>
        <text class="sing-name" v-else>{{ musicName }}</text>
      </view>
      <view class="clear-music" @click="clearMusic">
        <cover-image
          src="./../../../static/createIcons/close.png"
          class="icon"
        ></cover-image>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import bus from "@/utils/bus";
import { computed, onUnmounted, ref } from "vue";
const handleClick = () => {
  bus.emit("openMusicSheet");
};
const clearMusic = () => {};
let musicName = ref("");
let isShowDefaultMode = computed(() => {
  return musicName.value.length === 0 ? true : false;
});
let isScroll = computed(() => {
  return musicName.value.length > 5 ? true : false;
});

const getMuiscName = (name: string) => {
  musicName.value = name;
};
bus.on("getMuiscName", getMuiscName);
onUnmounted(() => {
  bus.off("getMuiscName", getMuiscName);
});
</script>

<style scoped lang="scss">
.choose-music {
  width: 750rpx;
  border-radius: 20rpx;
  position: absolute;
  top: 100rpx;
  left: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  height: 80rpx;
  .music-default-btn {
    width: 260rpx;
    height: 80rpx;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: #303030;
    border-radius: 20rpx;
    .default-text {
      color: #fff;
      font-size: 26rpx;
    }
    .icon {
      width: 26rpx;
      height: 26rpx;
      margin-right: 12rpx;
    }
  }
  .music-btn {
    width: 340rpx;
    height: 80rpx;
    border-radius: 20rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    background-color: #303030;
    .sing {
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 234rpx;
      padding-left: 26rpx;
      overflow: hidden;
      .icon {
        width: 26rpx;
        height: 26rpx;
      }
      .sing-text {
        width: 208rpx;
      }
      .sing-name {
        color: #fff;
        font-size: 26rpx;
        width: 208rpx;
        text-align: center;
      }
    }
    .clear-music {
      width: 80rpx;
      height: 80rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #303030;
      border-top-right-radius: 20rpx;
      border-bottom-right-radius: 20rpx;
      border-left: 1px solid #a0a0a0;
      .icon {
        width: 30rpx;
        height: 30rpx;
      }
    }
  }
}
</style>
