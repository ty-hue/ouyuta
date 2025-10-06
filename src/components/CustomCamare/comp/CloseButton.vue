<template>
  <cover-view class="close">
    <cover-image src="./../../../static/createIcons/close.png" class="left-top-icon" ></cover-image>
    <cover-image src="./../../../static/createIcons/back.png" class="left-top-icon" v-if="false" ></cover-image>
    <cover-view class="popover" v-if="false">
      <cover-view class="no-save">
        <cover-image
          src="./../../../static/createIcons/no-save.png"
          class="img"
        ></cover-image>
        <cover-view>不保存返回</cover-view>
      </cover-view>
      <cover-view class="save">
        <cover-image
          src="./../../../static/createIcons/save.png"
          class="img"
        ></cover-image>
        <cover-view>存草稿</cover-view>
      </cover-view>
    </cover-view>
  </cover-view>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.close {
  position: absolute;
  width: 750rpx;
  top: 100rpx;
  left: 0rpx;
  height: 80rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 20rpx;
  .left-top-icon{
    width: 50rpx;
    height: 50rpx;
    position: relative;
  }
  .popover {
    position: absolute;
    bottom: -200rpx;
    left: 0;
    width: 300rpx;
    display: flex;
    flex-direction: column;
    background: #fff;
    font-size: 30rpx;
    border-radius: 20rpx;
    .no-save {
      padding: 26rpx 0 26rpx 30rpx;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #333;
      color: red;
      .img {
        z-index: 99999;
        width: 40rpx;
        height: 40rpx;
        margin-right: 10rpx;
      }
    }
    .save {
      padding: 26rpx 0 26rpx 30rpx;
      display: flex;
      align-items: center;
      color: #000;
      .img {
        z-index: 99999;
        width: 40rpx;
        height: 40rpx;
        margin-right: 10rpx;
        vertical-align: text-bottom;
      }
    }
    &::after {
      position: absolute;
      left: 20rpx;
      top: -38rpx;
      content: "";
      border: 20rpx solid transparent;
      border-bottom-color: #fff;
    }
  }
}
</style>
