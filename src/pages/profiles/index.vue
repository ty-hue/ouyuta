<template>
  <div class="profiles-container">
    <NavBar bg-color="transparent" @getNavBarTotalHeight="getNavBarTotalHeight">
      <template #left>
        <up-icon name="arrow-leftward" :size="28" color="#fff" />
      </template>
      <template #right>
        <up-icon name="list" :size="28" color="#fff" />
      </template>
    </NavBar>
    <view class="header" :style="{ marginTop: -nbHeight + 'px' }">
      <image class="bg-img" src="./../../static/my-bg.jpg" mode="aspectFill" />
      <view class="header-content">
        <view class="avatar-box">
          <image
            class="avatar-img"
            src="./../../static/avatar.png"
            mode="aspectFill"
          />
        </view>
        <view class="name-box">
          <text class="name-text">llg</text>
          <text class="number-text">絮语号：sdk199912</text>
        </view>
      </view>
    </view>
    <view class="middle">
      <view class="data-box">
        <view class="data-show">
          <view class="data-item">
            <text class="item-number">7</text>
            <text class="item-text">获赞</text>
          </view>
          <view class="data-item">
            <text class="item-number">3</text>
            <text class="item-text">互关</text>
          </view>
          <view class="data-item">
            <text class="item-number">90</text>
            <text class="item-text">关注</text>
          </view>
          <view class="data-item">
            <text class="item-number">29</text>
            <text class="item-text">粉丝</text>
          </view>
        </view>
        <view class="edit-btn">
          <up-button
            type="primary"
            :custom-style="{
              border: 'none',
              background: '#33343F',
              color: '#fff',
              fontSize: '26rpx',
              fontWeight: '600',
              letterSpacing: '-0.72rpx',
              height: '60rpx',
              marginBottom: '30rpx',
              marginTop: '26rpx',
            }"
            >编辑主页</up-button
          >
        </view>
      </view>
      <view class="sign-edit">
        <text class="sign-text">点击添加介绍，让大家认识你...</text>
        <up-icon
          name="edit-pen"
          color="#4E586E
"
          size="20"
        ></up-icon>
      </view>
      <view class="tags">
        <text class="tag-item"> 澳大利亚 </text>
        <text class="tag-item"> 21岁 </text>
        <text class="tag-item"> 清华大学 </text>
      </view>
    </view>
    <up-sticky
      bgColor="transparent"
      :offset-top="nbHeight"
      custom-nav-height="0"
    >
      <view class="tabs">
        <view
          @click="tabItemClick(tab_item.id)"
          v-for="tab_item in list1"
          :key="tab_item.id"
          :class="[
            'tab-item',
            tab_item.id === tab_current ? 'tab-item_active' : '',
          ]"
        >
          {{ tab_item.name }}
        </view>
        <view
          class="slide"
          :style="{ transform: `translateX(${distance + 'px'})` }"
        ></view>
      </view>
    </up-sticky>
    <view class="uni-margin-wrap">
      <swiper
        class="swiper"
        :duration="500"
        :current="s_current"
        @transition="transition"
        @animationfinish="animationfinish"
      >
        <swiper-item v-for="s_item in list1" :key="s_item.id">
          <view class="swiper-item">{{ s_item.name }}</view>
        </swiper-item>
      </swiper>
    </view>
  </div>
</template>

<script lang="ts" setup>
import NavBar from "@/components/NavBar/index.vue";
import useTabHistoryHook from '@/hooks/useTabHistoryHook'
import type {
  SwiperOnTransitionEvent,
  SwiperOnAnimationfinishEvent,
} from "@uni-helper/uni-app-types";
import { reactive, ref, onMounted } from "vue";
useTabHistoryHook()
const list1 = reactive([
  {
    id: 0,
    name: "作品",
    list: [],
  },
  {
    id: 1,
    name: "推荐",
    list: [],
  },
  {
    id: 2,
    name: "收藏",
    list: [],
  },
  {
    id: 3,
    name: "喜欢",
    list: [],
  },
]);
const nbHeight = ref(0);
// 获取navbar的总高度 px值
const getNavBarTotalHeight = (navBarHeight: number) => {
  nbHeight.value = navBarHeight;
};

// 当前swiper所处的swiper-item对应的索引值
const s_current = ref(0);

// 当前tabs所处的tab的索引值
const tab_current = ref(0);

// 滑块滑动的距离
let distance = ref(0);

// 处理tab item 被点击
const tabItemClick = (id: number) => {
  tab_current.value = id;
  s_current.value = tab_current.value;
  whenClickSlideDis()
};
// 用于区分点击tab切换和手指滑动切换 true代表点击tab切换 false代表手指移动swiperitem切换
let flag = ref(false);
// 专门用于处理点击tab项时滑块的移动距离计算
const whenClickSlideDis = () => {
  flag.value = true;
  const swiperItemWidth = swiperItem.value?.width!;
  const rate =
    (tabItemInfo.value![1].left! - tabItemInfo.value![0].left!) /
    swiperItemWidth;
  distance.value = rate * (s_current.value * swiperItemWidth);
};

// 当swipe item 的位置发生变化的时会触发该函数
const transition = (e: SwiperOnTransitionEvent) => {
  // 如果用户是点击tab项进行滚动，则不进行后续滑片移动距离的计算
  if (flag.value) return;  
  const swiperItemWidth = swiperItem.value?.width!;
  let dx = e.detail.dx!;
  // dx 和 滑块移动距离的比例
  const rate =
    (tabItemInfo.value![1].left! - tabItemInfo.value![0].left!) /
    swiperItemWidth;
  // 得到swiper-item移动的距离
  const dxDis = dx + swiperItemWidth * s_current.value;
  // 得到滑块移动的距离
  distance.value = rate * dxDis;
};

const animationfinish = (e: SwiperOnAnimationfinishEvent) => {
  s_current.value = e.detail.current;
  tab_current.value = e.detail.current;
  whenClickSlideDis() // 这里再次调用是为了解决：当用户先点击tab切换，然后再切换的过程中立即又挪动了swiper-item，造成了滑块位置显示不正确的情况
  flag.value = false
};

// 存储每一个tab-item元素的dom信息
const tabItemInfo = ref<UniApp.NodeInfo[] | null>([]);
const swiperItem = ref<UniApp.NodeInfo | null>(null); // swiperItem的信息
onMounted(() => {
  // 获取每一个tab-item的信息
  uni
    .createSelectorQuery()
    .selectAll(".tab-item")
    .boundingClientRect((rects) => {
      (rects as UniApp.NodeInfo[]).forEach((rect, index) => {
        tabItemInfo.value?.push(rect);
      });
    })
    .exec();
  // 获取单个swiper-item的信息
  uni
    .createSelectorQuery()
    .select(".swiper-item")
    .boundingClientRect((rect) => {
      swiperItem.value = rect as UniApp.NodeInfo;
    })
    .exec();
});
</script>

<style lang="scss" scoped>
@import "./css/index.scss";
</style>
