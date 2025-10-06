<template>
  <view id="tips-container" class="tips-container" :style="{ ...customStyle }">
    <view
      class="tip"
      :style="{ height: tipHeight + 'rpx' }"
      v-for="tip in list"
      :key="tip.id"
    >
      <up-icon
        name="search"
        color="#afb0b4"
        size="22"
        @click="handleClickText(tip)"
      ></up-icon>
      <text class="tip-text" :style="textStyle" @click="handleClickText(tip)">{{
        tip.name
      }}</text>
      <cover-image
        @click="handleArrow(tip)"
        src="./../../static/createIcons/left-top-arrow.png"
        class="arrow-icon"
      ></cover-image>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import type { AudioItemType } from "@/types/apiReturnTypes";
const props = withDefaults(
  defineProps<{
    list: AudioItemType[]; // 显示多少条
    tipHeight: number; // 每一条的高度
    customStyle?: Record<string, string>;
    textStyle?: Record<string, string>;
  }>(),
  {
    customStyle: () => ({}),
    textStyle: () => ({}),
  }
);

const emit = defineEmits(["handleClickSearchIcon", "handleClickArrow"]);
// 点击tip
const handleClickText = (tip: AudioItemType) => {
  emit("handleClickSearchIcon", tip);
};
const handleArrow = (tip: AudioItemType) => {
  emit("handleClickArrow", tip);
};
</script>

<style lang="scss" scoped>
.tips-container {
  display: flex;
  flex-direction: column;
  .tip {
    border-bottom: 1rpx solid #ccc;
    display: flex;
    flex-direction: row;
    align-items: center;
    .tip-text {
      margin-left: 40rpx;
      flex: 1;
      color: #464850;
      font-size: 30rpx;
    }
    .arrow-icon {
      width: 40rpx;
      height: 40rpx;
    }
  }
}
</style>
