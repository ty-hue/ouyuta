<template>
  <!-- 给容器加唯一 id，避免 scoped 哈希影响 -->
  <view :id="containerId" ref="containerRef" :style="{...customStyle}" class="subsection-container">
    <view
      class="slide"
      ref="slideRef"
      :style="{ ...slideStyle, ...customSlideStyle }"
    ></view>
    <view
      class="subsection-item"
      v-for="it in list"
      :key="it.id"
      @click="handleClick(it.id)"
    >
      <text
        :class="[
          'subsection-item-text',
          current === it.id ? 'subsection-item-active' : '',
        ]"
        >{{ it.name }}</text
      >
    </view>
  </view>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, watch} from "vue";
import { getCurrentInstance } from "vue"

const instance = getCurrentInstance()
// 导入Weex动画模块
declare const weex: {
  requireModule: (moduleName: string) => any;
};
const animation = weex.requireModule("animation");

interface SubsectionItemType {
  id: number;
  name: string;
}

const props = defineProps({
  // 最外层容器自定义样式
  customStyle: {
    type: Object,
    default:{}
  },
  // 分段器数据
  list: {
    type: Array<SubsectionItemType>,
    required: true,
  },
  // 自定义滑块样式
  customSlideStyle: {
    type: Object,
    default:{}
  },
  // 激活文字颜色
  activeColor: {
    type: Number,
  },
  // 未激活文字颜色
  inactiveColor: {
    type: Number,
  },
  // 当前激活项的索引
  current: {
    type: Number,
    required: true,
  },
  containerId:{
    type:String,
    required:true
  }
});
const emit = defineEmits(["change"]);
// slide样式计算
const slideStyle = reactive({
  width: "",
  height: "",
});
// 容器的宽高
const containerInfo = reactive({
  width: 0,
  height: 0,
}); 
const containerRef = ref(null)
onMounted(() => {
  // 延时，确保 nvue 真实视图已渲染
  const query = uni.createSelectorQuery().in(instance);
    query
      .select(`#${props.containerId}`)
      .boundingClientRect((rect) => {        
        if (rect) {
          containerInfo.width = (rect as UniApp.NodeInfo).width!;
          containerInfo.height = (rect as UniApp.NodeInfo).height!;
          slideStyle.width = (rect as UniApp.NodeInfo).width! / props.list.length + "px";
          console.log(slideStyle.width,'itemwidth');

          slideStyle.height = (rect as UniApp.NodeInfo).height + "px";
        }
      })
      .exec();
});

const handleClick = (id: number) => {
  emit("change", id);
};
const slideRef = ref(null);
// 移动滑块到指定id的item位置
const moveSlideTo = (id: number) => {  
  try {
    if (!slideRef.value) return;    

    // 找到当前id在列表中的索引
    const index = props.list.findIndex((item) => item.id === id);
    if (index === -1) return;

    // 获取容器宽度计算每个item的宽度

    const containerWidth = containerInfo.width;
    const itemWidth = containerWidth / props.list.length;
    
    const targetX = index * itemWidth;
    

    // 使用animation模块实现平滑过渡
    animation.transition(
      slideRef.value,
      {
        styles: {
          transform: `translateX(${targetX}px)`,
        },
        duration: 300, // 动画持续时间（ms）
        timingFunction: "ease-in-out", // 缓动函数
        delay: 0,
      },
      () => {
        // 动画结束回调（可选）
      }
    );
  } catch (e) {
    console.log(e, "错误信息");
  }
};

// 监听current变化，更新滑块位置
watch(
  () => props.current,
  (newVal: number) => {
    moveSlideTo(newVal);
  }
);
</script>

<style lang="scss" scoped>
.subsection-container {
  position: relative;
  width: 300rpx;
  height: 60rpx;
  background-color: #464646;
  border-radius: 40rpx;
  display: flex;
  flex-direction: row;
  align-items: center;

  .subsection-item {
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    .subsection-item-text {
      color: #a3a3a3;
      font-size: 30rpx;
      z-index: 999;
    }
    .subsection-item-active {
      color: #fff;
    }
  }

  .slide {
    position: absolute;
    left: 0;
    top: 0;
    background-color: #5b5b5b;
    border-radius: 40rpx;
  }
}
</style>
