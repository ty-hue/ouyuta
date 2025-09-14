<template>
  <view class="container">
    <!-- #ifdef MP-WEIXIN || APP-PLUS -->
    <image
      src="./../../static/welcome-bg.jpg"
      mode="aspectFill"
      class="bg-img"
    />
    <!-- #endif -->
    <view class="content">
      <view class="title"
        >Find new friends <br />
        nearby</view
      >
      <view class="des">
        With milions of users all over the world, we gives you the ability to
        connect with people no matter where you are.
      </view>
      <view class="btns">
        <up-button
          type="primary"
          :custom-style="{
            borderRadius: '44rpx',
            border: 'none',
            background: '#fff',
            color: '#ff2d55',
            marginBottom: '20rpx',
            fontSize: '30rpx',
            fontWeight: '900',
            height:'88rpx'
          }"
          @click="goTargetPage('/pages/login/index')"
        >登陆</up-button>
        <up-button
          type="primary"
          :custom-style="{
            borderRadius: '44rpx',
            border: 'none',
            background: `linear-gradient(
          219.63deg,
          rgba(247, 131, 97, 1) 0%,
          rgba(245, 75, 100, 1) 100%
        )`,
            color: '#fff',
            fontSize: '30rpx',
            fontWeight: '900',
            height:'88rpx'
          }"
          @click="goTargetPage('/pages/register/index')"
        >注册</up-button>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
const goTargetPage = (url:string)=>{
  uni.navigateTo({url})
}
</script>

<style lang="scss" scoped>
@import './css/index.scss';
</style>
