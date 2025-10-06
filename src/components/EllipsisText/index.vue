<template>
  <text class="title" :style="{ ...customStyle }">{{ text }}</text>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    text: string;
    customStyle?: Record<string, any>;
  }>(),
  {
    customStyle: () => ({}),
  }
);
</script>

<style lang="scss" scoped>
.title {
  lines: 1;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 32rpx;
}
</style>
