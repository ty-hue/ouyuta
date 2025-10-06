<template>
  <view class="music-container">
    <view class="left" @click="handleClick">
      <view class="avatar">
        <cover-image
          :src="data.user.avatarUrl"
          class="music-avatar"
        ></cover-image>
        <view class="wave-box" v-if="isPlaying">
          <Wave />
        </view>
      </view>
      <view class="music-info">
        <EllipsisText
          :text="data.name"
          :custom-style="{
            color: isPlaying ? '#4fc3f7' : '#161823',
            fontWeight: '900',
          }"
        />

        <view class="music-info-author-time">
          <text class="author" v-if="!isHiddenAuthor">{{
            data.user.name
          }}</text>
          <text class="boundary" v-if="!isHiddenAuthor">·</text>
          <text class="time">{{ data.duration }}</text>
        </view>
      </view>
    </view>
    <view class="btns" v-if="isPlaying">
      <view class="star" v-if="!isHiddenAuthor" @click="handleCollectAudio">
        <up-icon name="star" color="#000" size="28" v-if="!isCollect"></up-icon>
        <up-icon name="star-fill" color="#FFC107" size="28" v-else></up-icon>
      </view>

      <view class="cut">
        <up-icon name="cut" color="#000" size="28"></up-icon>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import EllipsisText from "@/components/EllipsisText/index.vue";
import Wave from "./Wave.vue";
import { ref, onUnmounted, watch, onMounted, computed } from "vue";
import bus from "@/utils/bus";
import type { SetAudioIsPlayingParams } from "@/utils/bus";
import type { AudioItemType } from "@/types/apiReturnTypes";
import { collectAudio } from "@/request/apis/audio";
// 使用 withDefaults 包装 defineProps，设置默认值
const props = withDefaults(
  defineProps<{
    data: AudioItemType;
    isHiddenAuthor?: boolean;
    current: number | null;
    categoryId?: number;
  }>(),
  {
    // 这里指定 isHiddenAuthor 的默认值
    isHiddenAuthor: false,
  }
);
let timer: NodeJS.Timeout | null = null;
const emit = defineEmits(["handleActive"]);
const handleClick = () => {
  if (timer) {
    clearTimeout(timer);
  }
  // 触发父组件传递的函数，通知父组件改变current
  emit("handleActive", props.data.id);

  timer = setTimeout(() => {
    if (isPlaying.value) {
      bus.emit("getMuiscName", "");
      bus.emit("pauseAudio");
    } else {
      bus.emit("getMuiscName", props.data.name);
      bus.emit("seekAudio");
      bus.emit("playAudio");
    }
  });
};
// 是否正在播放
const isPlaying = ref(false);
watch(
  () => props.current,
  () => {
    if (props.current === props.data.id) {
      // 将音频信息传递给父组件
      bus.emit("currentAudio", props.data);
      // 监听isPlaying状态的变化
      bus.on("setAudioIsPlaying", setAudioIsPlaying);
    } else {
      // #ifdef APP-NVUE || H5
      isPlaying.value = false;
      // #endif
    }
  }
);
const setAudioIsPlaying = (data: SetAudioIsPlayingParams) => {
  if (props.data.id === data.audioId) {
    isPlaying.value = data.value;
  }
};
onUnmounted(() => {
  bus.off("setAudioIsPlaying", setAudioIsPlaying);
});
// #ifdef APP-NVUE || H5
onMounted(() => {
  bus.emit("checkActiveAudio", {
    audioId: props.data.id,
    callback: (result: boolean) => {
      if (result) {
        isPlaying.value = result;
      } else {
        isPlaying.value = result;
      }
    },
  });
});
// #endif
const isCollect = computed(() => props.data.isCollected);

const handleCollectAudio = async () => {
  try {
    const res = await collectAudio({ audioId: props.data.id });
    // 通知其他的swipercontent
    bus.emit("updateCollectStatus", {
      audioId: props.data.id,
      status: res.isCollected,
      categoryId: props.categoryId!,
    });
    if (props.categoryId !== 2) {
      bus.emit("updateCollectList", {
        ...props.data,
        isCollected: res.isCollected,
      });
    }
  } catch (e) {
    console.log(e, "错误信息");
  }
};
</script>

<style lang="scss" scoped>
.music-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  width: 690rpx;
  height: 140rpx;
  background-color: #fff;
  border-top: 1rpx solid #ccc;
  border-bottom: 1rpx solid #ccc;
  .left {
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    .avatar {
      position: relative;
      margin-right: 24rpx;
      .music-avatar {
        width: 100rpx;
        height: 100rpx;
        border-radius: 20rpx;
      }
      .wave-box {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100rpx;
        justify-content: center;
      }
    }
    .music-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 90rpx;
      .music-info-author-time {
        display: flex;
        flex-direction: row;
        align-items: center;
        .boundary {
          padding: 0 10rpx;
        }
        .author {
          font-size: 28rpx;
          color: #000;
        }
        .time {
          font-size: 28rpx;
          color: #000;
        }
      }
    }
  }
  .btns {
    width: 300rpx;
    height: 140rpx;
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    .cut {
      margin-right: 40rpx;
    }
    .star {
      width: 100rpx;
      height: 140rpx;
      display: flex;
      flex-direction: row;
      align-items: center;
    }
  }
}
</style>
