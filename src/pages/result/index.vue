<template>
  <view class="result-container">
    <view class="content">
      <view class="img">
        <image
          v-if="!data.status"
          class="status-img"
          src="./../../static/suc.png"
          mode="aspectFit"
        />
        <image
          v-else
          class="status-img"
          src="./../../static/fail.png"
          mode="aspectFit"
        />
      </view>
      <text class="status-title">
        {{ data.title }}
      </text>
      <view class="btn">
        <up-button
          @click="goBack"
          shape="circle"
          :custom-style="{
            borderRadius: '44rpx',
            border: 'none',
            background: '#fff',
            color: '#ff2d55',
            marginBottom: '20rpx',
            fontSize: '30rpx',
            fontWeight: '900',
            height: '88rpx',
          }"
          >返回</up-button
        >
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { onLoad } from "@dcloudio/uni-app";
import { reactive } from "vue";
enum StatusType {
  SUCCESS = 0,
  FAILURE = 1,
}
let data = reactive({
  status: StatusType.SUCCESS,
  title: "操作成功",
  backUrl: "",
});
onLoad((query: any) => {
  // query 就是传递过来的参数对象
  // 由于 statusInfo 是一个对象，uview-plus 会把它序列化成字符串传递
  // 你需要手动 JSON.parse
  if (query.statusInfo) {
    const { status, title, backUrl } = JSON.parse(query.statusInfo);
    data.status = Number(status);
    data.title = title;
    data.backUrl = backUrl
  }
});
const goBack = () => {
  uni.$u.route({
    url: data.backUrl,
    type: "redirect",
  });
};
</script>

<style lang="scss" scoped>
@import "./css/index.scss";
</style>
