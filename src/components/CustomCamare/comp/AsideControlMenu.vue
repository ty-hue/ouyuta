<template>
  <cover-view class="aside">
    <cover-view class="aside-item" @click="handleFlip">
      <cover-image
        src="./../../../static/createIcons/flip.png"
        class="icon"
      ></cover-image>
      <text class="item-text">翻转</text>
    </cover-view>
    <cover-view class="aside-item" @click="handleFlash">
      <cover-image
        src="./../../../static/createIcons/flash.png"
        class="icon"
        v-if="flashMode === FlashValueType.OFF"
      ></cover-image>
      <cover-image
        src="./../../../static/createIcons/flash-open.png"
        class="icon"
        v-else-if="flashMode === FlashValueType.ON"
      ></cover-image>
      <cover-image
        src="./../../../static/createIcons/flash-auto.png"
        class="icon"
        v-else
      ></cover-image>

      <text class="item-text">闪光灯</text>
    </cover-view>
    <cover-view class="aside-item" @click="handleSetting">
      <cover-image
        src="./../../../static/createIcons/setting.png"
        class="icon"
      ></cover-image>
      <text class="item-text">设置</text>
    </cover-view>
    <cover-view class="aside-item" v-if="false">
      <cover-image
        src="./../../../static/createIcons/mic-open.png"
        class="icon"
      ></cover-image>
      <text class="item-text">麦克风</text>
    </cover-view>
    <cover-view class="aside-item">
      <cover-image
        src="./../../../static/createIcons/meiyan.png"
        class="icon"
      ></cover-image>
      <text class="item-text">美颜</text>
    </cover-view>
    <cover-view class="aside-item">
      <cover-image
        src="./../../../static/createIcons/lvjing.png"
        class="icon"
      ></cover-image>
      <text class="item-text">滤镜</text>
    </cover-view>
    <cover-view class="aside-item">
      <cover-image
        src="./../../../static/createIcons/speed.png"
        class="icon"
      ></cover-image>
      <text class="item-text">快慢速</text>
    </cover-view>
  </cover-view>
</template>
<script lang="ts" setup>
  import bus from '@/utils/bus'
import { FlashValueType } from "@/types/enums";
import { ref } from "vue";
const emit = defineEmits(["flip", "flash"]);
const handleFlip = () => {
  emit("flip");
};
const flashMode = ref<FlashValueType>(FlashValueType.OFF);
const handleFlash = () => {
  if (flashMode.value === FlashValueType.OFF) {
    flashMode.value = FlashValueType.ON;
  } else if (flashMode.value === FlashValueType.ON) {
    flashMode.value = FlashValueType.AUTO;
  } else {
    flashMode.value = FlashValueType.OFF;
  }
  emit("flash", flashMode.value);
};
const handleSetting = ()=>{
  bus.emit('openSettingSheet')
}
</script>

<style scoped lang="scss">
.aside {
  position: absolute;
  right: 20rpx;
  top: 200rpx;
  .aside-item {
    display: flex;
    flex-direction: column;
    width: 100rpx;
    height: 100rpx;
    align-items: center;
    justify-content: center;
    margin-bottom: 10rpx;
    .icon {
      width: 40rpx;
      height: 40rpx;
    }
    .item-text {
      margin-top: 10rpx;
      font-size: 24rpx;
      font-weight: normal;
      letter-spacing: 1rpx;
      color: #fff;
    }
  }
}
</style>
