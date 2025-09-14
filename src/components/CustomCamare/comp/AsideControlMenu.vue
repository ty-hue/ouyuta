<template>
    <cover-view class="aside">
      <cover-view class="aside-item">
        <cover-view class="iconfont icon-fanzhuan"></cover-view>
        <cover-view class="item-text">翻转</cover-view>
      </cover-view>
    </cover-view>
</template>


<script lang="ts" setup>
</script>


<style scoped lang="scss">
  .aside{
    position: absolute;
    right: 20rpx;
    top: 200rpx;
    .aside-item{
      display: flex;
      flex-direction: column;
      width: 100rpx;
      height: 100rpx;
      align-items: center;
      justify-content: center;
      color: #fff;
      .iconfont{
        font-size: 50rpx;
        font-weight: 900;
      }
      .item-text{
        margin-top: 10rpx;
        font-size: 24rpx;
        font-weight: normal;
        letter-spacing: 1rpx;
      }
    }
  }
 </style>