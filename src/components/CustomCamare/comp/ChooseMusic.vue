<template>
      <cover-view class="choose-music">
        <cover-view class="music-default-btn">
          <cover-view class="iconfont icon-yinle"></cover-view>
          <cover-view>选择音乐</cover-view>
        </cover-view>
        <cover-view v-if="false" class="music-btn">
          <cover-view class="sing">
            <cover-image src="./../../../static/createIcons/music.png" ></cover-image>
            <cover-text class="sing-name">月半小夜曲</cover-text>
          </cover-view>
          <cover-view class="clear-music">
            <cover-image src="./../../../static/createIcons/close.png"></cover-image>
          </cover-view>
        </cover-view>
      </cover-view>
</template>



<script lang='ts' setup>
</script>


<style scoped lang="scss">
    .choose-music{
      position: absolute;
      top: 100rpx;
      left: 50%;
      transform: translateX(-50%);
      background-color: #33343f;
      color: #fff;
      font-size: 26rpx;
      border-radius: 20rpx;
      box-sizing: border-box;
      .music-default-btn{
        width: 160rpx;
        height: 80rpx;
        display: flex;
        align-items: center;
       .iconfont{
        font-size: 40rpx;
        margin-right: 6rpx;
       }
      }
      .music-btn{
        width: 340rpx;
        height: 80rpx;
        padding-left: 26rpx; 
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .sing{
          display: flex;
          align-items: center;
          flex: 1;
          overflow: hidden;
          .iconfont{
            font-size: 40rpx;
            margin-right: 6rpx;
          }
          .sing-name{
            width: 160rpx;
          }
        }
        .clear-music{
          width: 80rpx;
          height: 80rpx;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #33343f;
          border-top-right-radius: 20rpx;
          border-bottom-right-radius: 20rpx;
          border-left: 1px solid #fff;
          .iconfont{
            font-size: 40rpx;
          }
        }
      }
    }
</style>