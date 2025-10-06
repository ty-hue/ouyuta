<template>
  <view class="tabBar-container"  :style="{height:tabBarHeight+'px'}">
    <view class="tabs"  :style="{height:tabBarHeight+'px'}">
      <view
        class="tab-item"
        v-for="tabItem in tabList"
        :key="tabItem.id"
        @click="handleClick(tabItem.id)"
      >
        <text  :class="['tab-item-text',currentIndex === tabItem.id ? 'tab-item-text-active' : '']">{{
          tabItem.name
        }}</text>
      </view>
    </view>
 <!--   <view class="btns" v-if="!isShowBtns">
      <view class="next-btn">下一步</view>
    </view> -->
  </view>
</template>

<script lang="ts" setup>
import bus from "@/utils/bus";
import { onMounted, onUnmounted, ref } from "vue";
interface tabItem {
  id: number;
  name: string;
}
defineProps({
  tabList: {
    type: Array<tabItem>,
    required: true,
  },
  tabBarHeight:{
    type:Number,
    required:true
  }
});
const emit = defineEmits(['changeComp'])
const currentIndex = ref(1);
const handleClick = (id: number) => {
  currentIndex.value = id;
  emit('changeComp',currentIndex.value);
};
const isShow = ref(false);
const handleIsHide = (isHide: boolean) => {
  isShow.value = isHide;
  console.log(isShow.value, "os");
};
const handleIsShowBtns = (isShowBtn: boolean) => {
  isShowBtns.value = isShowBtn;
};
const isShowBtns = ref(true);
onMounted(() => {
  bus.on("isHide", handleIsHide);
  bus.on("isShowBtns", handleIsShowBtns);
});
onUnmounted(() => {
  bus.off("isHide", handleIsHide);
  bus.off("isShowBtns", handleIsShowBtns);
});
</script>

<style scoped lang="scss">
.tabBar-container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 750rpx;
  background-color: #000;
  .tabs {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    .tab-item {
	  height: 100%;
      width: 120rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .tab-item-text{
      color: #4e586e;
      font-size: 28rpx;
    }
    // tab项激活样式
    .tab-item-text-active {
      color: #fff;
      font-weight: 900;
    }
  }
  .btns {
    color: #fff;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .next-btn {
      width: 400rpx;
      height: 80rpx;
      border-radius: 40rpx;
      background-color: #C25E5E;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
