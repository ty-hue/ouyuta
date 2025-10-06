<template>
  <view class="music-container">
    <view class="left" @click="handlePlayAudio">
      <view class="picture-box">
        <image class="bg-img" :src="data.user.avatarUrl" mode="aspectFit">
        </image>
        <view :class="['mark', classArr[0]]">
          <text :class="['mark-text', classArr[1]]">TOP {{ order }}</text>
        </view>
        <view class="status">
          <up-icon
            v-if="!isExpanded"
            name="play-right-fill"
            color="#fff"
            size="30"
          ></up-icon>
          <up-icon name="pause" color="#fff" size="30" v-else></up-icon>
        </view>
      </view>
      <view class="music-info">
        <EllipsisText
          :text="data.name"
          :custom-style="{ color: '#161823', fontWeight: '900' }"
        />
        <text class="music-author">{{ data.user.name }}</text>
        <text class="music-duration">{{ data.duration }}</text>
      </view>
    </view>

    <!-- 右侧按钮 -->
    <view class="btns" :class="{ expanded: isExpanded }">
      <!-- 其他按钮（只有展开后显示） -->
      <view class="cut" v-if="isExpanded">
        <up-icon name="cut" color="#161823" bold size="24"></up-icon>
      </view>
      <!-- star 按钮永远显示 -->
      <view class="star" @click="handleCollectAudio">
        <up-icon
          name="star"
          color="#161823"
          bold
          size="24"
          v-if="!isCollect"
        ></up-icon>
        <up-icon
          name="star-fill"
          color="#FFC107"
          bold
          size="24"
          v-else
        ></up-icon>
      </view>
      <view class="use-btn" v-if="isExpanded" @click="useMusic">
        <text class="use-btn-text">使用</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import EllipsisText from "@/components/EllipsisText/index.vue";
import type { AudioItemType } from "@/types/apiReturnTypes";
import { ref, computed, watch, onUnmounted } from "vue";
import { collectAudio } from "@/request/apis/audio";
import bus from "@/utils/bus";
const props = withDefaults(
  defineProps<{
    data: AudioItemType;
    order?: number;
    current: number;
  }>(),
  {}
);
const emit = defineEmits(["handleActive"]);
// 展开状态
const isExpanded = ref(false);

const classArr = computed(() => {
  if (!props.order) {
    return ["mark-last", "mark-last-text"];
  }
  if (props.order > 0 && props.order <= 3) {
    return ["", ""];
  } else if (props.order > 3 && props.order <= 12) {
    return ["mark-tweety", "mark-tweety-text"];
  } else {
    return ["mark-last", "mark-last-text"];
  }
});
const handlePlayAudio = () => {
  emit("handleActive", props.data.id);
  setTimeout(() => {
    if (!isExpanded.value) {
      // 设置激活态并播放音频
      innerAudioContext?.play();
      isExpanded.value = !isExpanded.value;
    } else {
      innerAudioContext?.pause();
      innerAudioContext?.seek(0);
      isExpanded.value = !isExpanded.value;
    }
  });
};
let innerAudioContext: UniApp.InnerAudioContext | null = null; // 音频上下文
const handleEnded = () => {
  isExpanded.value = false;
};
watch(
  () => props.current,
  () => {
    if (props.current === props.data.id) {
      // 创建内部音频上下文
      innerAudioContext = uni.createInnerAudioContext();
      // 设置音频源
      innerAudioContext.src = props.data.audioUrl;
      innerAudioContext.onEnded(handleEnded);
    } else {
      // 销毁音频上下文，去除激活状态
      innerAudioContext?.destroy();
      innerAudioContext = null;
      isExpanded.value = false;
    }
  }
);
onUnmounted(() => {
  innerAudioContext?.destroy();
  innerAudioContext = null;
});
let isCollect = ref(props.data.isCollected);
const handleCollectAudio = async () => {
  try {
    const res = await collectAudio({ audioId: props.data.id });
    // 通知其他的swipercontent
    isCollect.value = res.isCollected;
  } catch (e) {
    console.log(e, "错误信息");
  }
};
const useMusic = () => {
  bus.emit("getMuiscName", props.data.name);
  bus.emit("changeRecommendSwiperData", props.data);
  // 关闭所有sheet
  bus.emit("closeSearchMusicSheet");
  bus.emit("closeMusicSheet");
};
</script>

<style scoped lang="scss">
.music-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 10rpx 0rpx;
  height: 120rpx;
  .left {
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    .picture-box {
      width: 120rpx;
      height: 120rpx;
      position: relative;
      margin-right: 10rpx;
      .mark {
        position: absolute;
        left: 0;
        top: 0;
        width: 80rpx;
        height: 30rpx;
        background-color: #face15;
        display: flex;
        align-items: center;
        justify-content: center;
        border-top-left-radius: 4rpx;
        border-bottom-right-radius: 10rpx;
        .mark-text {
          color: #7e4406;
          font-size: 20rpx;
          font-weight: 900;
          font-style: italic;
        }
      }
      .mark-tweety {
        background-color: #050408;
        .mark-tweety-text {
          color: #fff;
        }
      }
      .mark-last {
        background-color: transparent;
        .mark-last-text {
          color: transparent;
        }
      }
      .bg-img {
        width: 120rpx;
        height: 120rpx;
        border-radius: 10rpx;
        position: relative;
        z-index: 1;
      }
      .status {
        position: absolute;
        left: 0;
        top: 0;
        width: 120rpx;
        height: 120rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: row;
      }
    }
    .music-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .music-author {
        margin: 10rpx 0;
        font-size: 26rpx;
        color: #7a7b82;
      }
      .music-duration {
        font-size: 26rpx;
        color: #7a7b82;
      }
    }
  }
  .btns {
    width: 80rpx; /* 默认只显示星星 */
    height: 120rpx;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    overflow: hidden;

    .use-btn {
      border-radius: 10rpx;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      background-color: #fe2c55;
      padding: 12rpx 24rpx;
      .use-btn-text {
        color: #fff;
        font-weight: bold;
        font-size: 24rpx;
      }
    }
  }

  /* 展开后宽度变大 */
  .btns.expanded {
    width: 300rpx;
  }
}
</style>
