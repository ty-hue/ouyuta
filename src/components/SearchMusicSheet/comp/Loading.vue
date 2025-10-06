<template>
  <view class="loading-container" :style="{ height: totalHeight + 'rpx' }">
    加载中。。。
  </view>
</template>
<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    totalHeight: number;
  }>(),
  {}
);
</script>
<style lang="scss" scoped>
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
}
</style>
