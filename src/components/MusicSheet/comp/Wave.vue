<template>
  <view class="rhythm-container">
    <!-- #ifdef APP-NVUE -->
    <!-- nvue 端使用 animation 插件 -->
    <view
      v-for="(bar, index) in bars"
      :key="index"
      ref="barRefs"
      class="bar"
    ></view>
    <!-- #endif -->

    <!-- #ifndef APP-NVUE -->
    <!-- H5 和 小程序 使用动态 style 控制 -->
    <view
      v-for="(scale, index) in scales"
      :key="index"
      class="bar"
      :style="{ transform: `scaleY(${scale})` }"
    ></view>
    <!-- #endif -->
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

// animation 模块（nvue 专用）
let animation: any = null
// #ifdef APP-NVUE
animation = uni.requireNativePlugin('animation')
// #endif

const BAR_COUNT = 5

// #ifdef APP-NVUE
const barRefs = ref<any[]>([])
// #endif

// #ifndef APP-NVUE
// H5 / 小程序端用响应式数据
const scales = ref<number[]>(Array.from({ length: BAR_COUNT }, () => 1))
// #endif

const bars = Array.from({ length: BAR_COUNT })
let timer: number | null = null

onMounted(() => {
  timer = setInterval(() => {
    // #ifdef APP-NVUE
    barRefs.value.forEach((el) => {
      if (!el) return
      const scale = 0.2 + Math.random() * 1.3
      animation.transition(el, {
        styles: { transform: `scaleY(${scale})` },
        duration: 200,
        timingFunction: 'ease-out'
      })
    })
    // #endif

    // #ifndef APP-NVUE
    scales.value = scales.value.map(() => 0.2 + Math.random() * 1.3)
    // #endif
  }, 200) as unknown as number
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.rhythm-container {
  flex-direction: row;
  align-items: flex-end;
  justify-content: center;
  height: 200rpx;
}

.bar {
  width: 8rpx;
  height: 30rpx;
  margin: 0 4rpx;
  background-color: #4fc3f7;
  transform-origin: bottom center;
  transition: transform 0.2s ease-out; /* H5/小程序 平滑动画 */
}
</style>
