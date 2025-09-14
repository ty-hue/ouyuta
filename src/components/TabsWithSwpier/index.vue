<template>
  <up-sticky :bgColor="bgColor" :offset-top="nbHeight" custom-nav-height="0">
    <scroll-view
      :scroll-x="true"
      class="tabs"
      :scroll-left="tabsScrollLeft"
      @scrolltoupper="tabsScrolltoupper"
      @scrolltolower="tabsScrolltolower"
      scroll-with-animation
    >
      <view class="tabs-content">
        <view
          @click="tabItemClick(tab_item.id)"
          v-for="tab_item in list1"
          :key="tab_item.id"
          class="tab-item"
          :style="
            tab_item.id === tab_current
              ? { ...tabItemStyle, ...tabItemActiveStyle }
              : { ...tabItemStyle }
          "
        >
          <span class="tab-text">{{ tab_item.name }}</span>
        </view>
        <view
          class="slide"
          :style="{
            transform: `translateX(${slideInitPostion + distance + 'px'})`,
            width: slideWidth + 'px',
            ...slideStyle,
          }"
        ></view>
      </view>
    </scroll-view>
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

    
  </up-sticky>
</template>

<script lang="ts" setup>
import type {
  SwiperOnTransitionEvent,
  SwiperOnAnimationfinishEvent,
  ScrollViewOnScrolltoupperEvent,
  ScrollViewOnScrolltolowerEvent,
} from "@uni-helper/uni-app-types";
import { reactive, ref, onMounted, getCurrentInstance } from "vue";
import { extractNumber } from "@/utils/index";

const props = defineProps({
  // 总渲染数据
  list: {
    type: Array,
    required: true,
  },
  // 当前页面的navbar的高度,用于粘性布局时使用
  nbHeight: {
    type: Number,
    required: true,
  },
  // 每一个tabitem的样式对象
  tabItemStyle: {
    type: Object,
    default: {},
  },
  tabItemActiveStyle: {
    type: Object,
    default: {
      color: "#fff",
      fontWeight: 900,
    },
  },
  // 滑片宽度使用这个，只允许px单位以及%单位，其他单位无效
  slideRealWidth: {
    type: String,
  },
  // 这里不允许传递width,千万注意
  slideStyle: {
    type: Object,
    default: {},
  },
  // 组件总体的背景色 ,默认透明
  bgColor:{
    type:String,
    default:'transparent'
  }
});
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
    name: "新闻",
    list: [],
  },
  {
    id: 4,
    name: "推荐",
    list: [],
  },
  {
    id: 5,
    name: "收藏",
    list: [],
  },
  {
    id: 6,
    name: "新闻",
    list: [],
  },
]);

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
  whenClickSlideDis();
  switchTabToScroll(itemArr.value![id]);
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
// tabs内容的总宽度
const tabsContentWidth = ref(0);
const animationfinish = (e: SwiperOnAnimationfinishEvent) => {
  s_current.value = e.detail.current;
  tab_current.value = e.detail.current;
  whenClickSlideDis(); // 这里再次调用是为了解决：当用户先点击tab切换，然后再切换的过程中立即又挪动了swiper-item，造成了滑块位置显示不正确的情况
  flag.value = false;
  switchTabToScroll(itemArr.value![tab_current.value]);
};

// 存储每一个tab-item元素的dom信息
const tabItemInfo = ref<UniApp.NodeInfo[] | null>([]);
const swiperItem = ref<UniApp.NodeInfo | null>(null); // swiperItem的信息
const slideWidth = ref(0);
const slideInitPostion = ref(0); // 滑块的初始位置
const itemArr = ref<UniApp.NodeInfo[] | null>([]);
const ins = getCurrentInstance();
const tabs = ref<UniApp.NodeInfo | null>(null); // tabs的dom信息
onMounted(() => {
  // 用 Promise 封装节点查询，确保顺序执行
  const queryTabTexts = new Promise<UniApp.NodeInfo[]>((resolve) => {
    uni
      .createSelectorQuery()
      .in(ins)
      .selectAll(".tab-text")
      .boundingClientRect((rects) => {
        resolve(rects as UniApp.NodeInfo[]);
      })
      .exec();
  });
  const queryTabs = new Promise<UniApp.NodeInfo>((resolve) => {
    uni
      .createSelectorQuery()
      .in(ins)
      .select(".tabs")
      .boundingClientRect((rect) => {
        resolve(rect as UniApp.NodeInfo);
      })
      .exec();
  });
  const queryTabItems = new Promise<UniApp.NodeInfo[]>((resolve) => {
    uni
      .createSelectorQuery()
      .in(ins)
      .selectAll(".tab-item")
      .boundingClientRect((rects) => {
        resolve(rects as UniApp.NodeInfo[]);
      })
      .exec();
  });

  const querySwiperItem = new Promise<UniApp.NodeInfo>((resolve) => {
    uni
      .createSelectorQuery()
      .in(ins)
      .select(".swiper-item")
      .boundingClientRect((rect) => {
        resolve(rect as UniApp.NodeInfo);
      })
      .exec();
  });

  // 等待所有节点查询完成后再处理
  Promise.all([queryTabTexts, queryTabItems, querySwiperItem, queryTabs])
    .then(([tabTexts, tabItems, swiperItemRect, tabsRect]) => {
      // 赋值节点信息
      tabItemInfo.value = tabTexts;
      itemArr.value = tabItems;
      swiperItem.value = swiperItemRect;
      tabs.value = tabsRect;
      // 处理 tabs 总宽度（此时 itemArr 已确保有值）
      if (itemArr.value && itemArr.value.length) {
        tabsContentWidth.value = itemArr.value.reduce((acc, item) => {
          return acc + (item.width || 0); // 增加容错处理
        }, 0);
      }

      // 处理滑块宽度和初始位置（确保 tabTexts 有值）
      if (tabTexts.length === 0) return; // 容错：如果没有找到节点，直接返回

      const firstTabItemTextWidth = tabTexts[0].width || 0;
      const customSlideWidth = props.slideRealWidth;
      let width: number;

      if (customSlideWidth) {
        width = extractNumber(customSlideWidth) || 0;
        if (customSlideWidth.endsWith("px")) {
          slideWidth.value = width;
          slideInitPostion.value =
            tabTexts[0].left! + (firstTabItemTextWidth - width) / 2;
        } else if (customSlideWidth.endsWith("%")) {
          slideWidth.value = (tabsContentWidth.value || 0) * (width / 100);
          slideInitPostion.value =
            tabTexts[0].left! + (firstTabItemTextWidth - slideWidth.value) / 2;
        } else {
          slideWidth.value = firstTabItemTextWidth;
          slideInitPostion.value = tabTexts[0].left!;
        }
      } else {
        slideWidth.value = firstTabItemTextWidth;
        slideInitPostion.value = tabTexts[0].left!;
      }
    })
    .catch((err) => {
      console.error("节点查询失败：", err);
    });
});
const tabsScrolltoupper = (e: ScrollViewOnScrolltoupperEvent) => {
  console.log(e);
};
const tabsScrolltolower = (e: ScrollViewOnScrolltolowerEvent) => {
  console.log(e);
};
const tabsScrollLeft = ref(0); // tabs滚动条的位置
// 点击tabItem时，调整滚动条位置
const switchTabToScroll = (tabItem: UniApp.NodeInfo) => {
  const tabsWidthHalf = tabs.value?.width! / 2; // 滚动容器宽度的一半
  console.log(tabsWidthHalf, "中线");
  const { left, width } = tabItem;
  console.log(left, "tabitemLeft");
  console.log(width, "tabItemWidth");
  const ItemWithTabsHalfDis = left! - tabsWidthHalf;
  console.log(ItemWithTabsHalfDis, "tabItem的left - 中线");
  // 当点击left值大于滚动容器宽度一半的tabItem时，就需要重新设置滚动条的位置
  if (tabItem.left! > tabsWidthHalf) {
    console.log("进来了");
    console.log(ItemWithTabsHalfDis);
    tabsScrollLeft.value = ItemWithTabsHalfDis + width! / 2;
    console.log(tabsScrollLeft.value, "最终滚动条位置");
  } else {
    tabsScrollLeft.value = 0;
  }
};
</script>

<style lang="scss" scoped>
@import "./css/index.scss";
</style>
