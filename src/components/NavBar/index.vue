<template>
  <view class="nav-bar-container" :style="{ backgroundColor: bgColor }">
    <!-- 状态栏占位 -->
    <!-- #ifdef MP-WEIXIN || APP-PLUS -->
    <view
      class="status-placeholder"
      :style="{ height: statusHeight + 'rpx' }"
    ></view>
    <!-- #endif -->
    <!-- #ifdef H5 -->
    <view :style="{ height: statusHeight + 'rpx' }"></view>
    <!-- #endif -->
    <view class="nav-bar-content" :style="{ paddingTop: paddingTop + 'rpx' }">
      <view
        class="content"
        :style="{
          height: height + 'rpx',
          paddingLeft: 20 + 'rpx',
          paddingRight: 20 + gap + 'rpx',
        }"
      >
        <slot name="left">
          <!-- 设置一个插槽默认值,防止外部只对right插槽传递值的时候，布局混乱 -->
          <view></view>
        </slot>
        <slot name="right"></slot>
      </view>
      <!-- 胶囊占位 -->
      <!-- #ifdef MP-WEIXIN -->
      <view
        class="capsule-placeholder"
        :style="{ width: width + 'rpx', paddingRight: distanceToRight + 'rpx' }"
      ></view>
      <!-- #endif -->
      <!-- 中间插槽需要对位置进行特殊处理 -->
      <view class="center" :style="{ height: height + 'rpx' }">
        <slot name="center"></slot>
      </view>
    </view>
  </view>
  <!-- 底部垫片占位 -->
  <view
    class="nav-bar-placeholder"
    :style="{ height: totalHeight + 'rpx' }"
  ></view>
</template>

<script lang="ts" setup>
import {rpxToPx} from '@/utils/index'
const props = defineProps({
  bgColor: { type: String, default: "#000" },
  gap: { type: Number, default: 0 }, // 仅小程序生效
});

const systemInfo = uni.getSystemInfoSync();
const screenWidthPx = systemInfo.screenWidth; // 屏幕宽度（px）
const rpxRate = 750 / screenWidthPx; // px转rpx的系数

// 状态栏高度（rpx）
let statusHeight = systemInfo.statusBarHeight! * rpxRate;
statusHeight = statusHeight ? statusHeight : 40;
// 初始化变量
let distanceToRight = 30; // 右侧距离（rpx）
let paddingTop = 0; // 胶囊顶部距离状态栏底部（rpx）
let height = 80; // 内容区域高度（rpx）
let width = 0; // 胶囊宽度（rpx）

// 微信小程序适配（胶囊按钮）
// #ifdef MP-WEIXIN
const capsuleInfo = uni.getMenuButtonBoundingClientRect();
distanceToRight = 750 - capsuleInfo.right * rpxRate; // 右侧距离（rpx）
paddingTop = (capsuleInfo.top - systemInfo.statusBarHeight!) * rpxRate; // 顶部间距（rpx）
width = capsuleInfo.width * rpxRate; // 胶囊宽度（rpx）
height = capsuleInfo.height * rpxRate; // 胶囊高度（rpx）
// #endif

// 非小程序端：根据设备类型调整默认值
// #ifndef MP-WEIXIN
if (screenWidthPx > 600) {
  // 平板判定
  height = 100;
  distanceToRight = 40;
}
// #endif
const totalHeight = height + statusHeight + paddingTop; // 垫片的高度
const emit = defineEmits(['getNavBarTotalHeight']);
emit('getNavBarTotalHeight',rpxToPx(totalHeight)); // 告知外部NarBar的总高度

</script>

<style scoped lang="scss">
@import './css/index.scss';
</style>
