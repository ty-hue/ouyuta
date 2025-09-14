<template>
  <view class="create-container">
    <view class="top">
      <view class="close">
        <up-icon name="close" @click="goBack" v-if="!isFinished && !isRecording" />
        <up-icon name="arrow-left" @click="isSave" v-if="isFinished" />
        <view class="popover" v-if="isShowPopover">
          <view class="no-save">
            <i class="iconfont icon-return"></i>
            <text>不保存返回</text>
          </view>
          <view class="save">
            <i class="iconfont icon-tianjia"></i>
            <text>存草稿</text>
          </view>
        </view>
      </view>
      <view class="choose-music" v-if="!isRecording">
        <view class="music-default-btn">
          <i class="iconfont icon-yinle"></i>
          <text>选择音乐</text>
        </view>
        <view v-if="false" class="music-btn">
          <view class="sing">
            <i class="iconfont icon-yinle"></i>
            <text class="sing-name">月半小夜曲</text>
          </view>
          <view class="clear-music">
            <i class="iconfont icon-quxiao"></i>
          </view>
        </view>
      </view>
    </view>
    <view class="aside" v-if="!isFinished">
      <view class="aside-item">
        <i class="iconfont icon-fanzhuan"></i>
        <text class="item-text">翻转</text>
      </view>
    </view>
    <SuspensionOperation />
    <TabBar :tab-list="tabList" />
    <up-overlay
      :z-index="999"
      :show="statusFailList.length > 0"     
      :mask-click-able="false"
    >
      <view class="wrap">
        <view class="wrap-content" @tap.stop>
          <view class="content-text">
            <text class="content-title">在絮语APP拍摄</text>
            <text class="content-sub-title"> 开启以下权限即可进入拍摄 </text>
          </view>
          <view class="permission-list">
            <view
              @click="goSysSettingPage(permission.permissionName)"
              class="permission-item"
              v-for="permission in statusFailList"
              :key="permission.id"
            >
              <up-icon :name="permission.iconName" />
              <text class="item-name"
                >开启{{ permission.permissionName }}</text
              ></view
            >
          </view>
        </view>
      </view>
    </up-overlay>
  </view>
</template>

<script lang="ts" setup>
import bus from "@/utils/bus";
import TabBar from "./comp/TabBar.vue";
import useTabHistoryHook from "@/hooks/useTabHistoryHook";
import { permission } from "@/utils/permission/index";
import { computed, ref, onUnmounted, onMounted } from "vue";
// #ifdef MP-WEIXIN
import { wxPermission } from "@/utils/permission/wx-permission/permission";
// #endif
// #ifdef APP-PLUS
import { nativePermission } from "@/utils/permission/native-permission/permission";
// #endif
import { onHide, onShow } from "@dcloudio/uni-app";
import type { PermissionStatusType } from "@/types/permissionStatusType";
import { SysPermissionNameType } from "@/types/enums";
import { TABBARPATHLIST } from "@/const/sysConst";
import SuspensionOperation from "./comp/SuspensionOperation.vue";
const { backPath } = useTabHistoryHook();
onShow(() => {
  requestCameraPermission();
  requestRecordPermission();
});
const isFinished = ref(false);
const isFinishTask = (isFinish: boolean) => {
  isFinished.value = isFinish;
};
const isRecording = ref(false) // 是否正在录制视频中
const recording = (isDoingRecord:boolean)=>{
   isRecording.value = isDoingRecord
}
onMounted(() => {
  bus.on("isFinish", isFinishTask);
  bus.on('isDoingRecord',recording)
});
const permissionStatusList = ref<PermissionStatusType[]>([]); //用于保存权限请求状态的数组
const requestCameraPermission = async () => {
  var result = await permission.requestCameraPermission();
  addPermissionResult({
    id: 0,
    status: result,
    permissionName: SysPermissionNameType.CAMERA,
    iconName: "camera-fill",
  });
};
const requestRecordPermission = async () => {
  const result = await permission.requestRecordPermission();
  addPermissionResult({
    id: 1,
    status: result,
    permissionName: SysPermissionNameType.MICROPHONE,
    iconName: "mic",
  });
};
// 修改权限状态数组的方法
const addPermissionResult = (permissionResult: PermissionStatusType) => {
  // 存在就修改status值
  permissionStatusList.value.forEach((it) => {
    if (it.id === permissionResult.id) {
      it.status = permissionResult.status;
      return;
    }
  });
  // 不存在就添加
  permissionStatusList.value.push(permissionResult);
};
// 计算出 状态为false的权限
const statusFailList = computed(() => {
  console.log(permissionStatusList.value.filter((it) => !it.status));

  return permissionStatusList.value.filter((it) => !it.status);
});
// 跳转到权限设置页
const goSysSettingPage = (permissionName: string) => {
  // #ifdef APP-PLUS
  nativePermission.gotoAppPermissionSetting();
  // #endif
  // #ifdef MP-WEIXIN
  wxPermission.guideToSetting(permissionName);
  // #endif
};
onShow(() => {
  uni.hideTabBar();
});
onHide(() => {
  uni.showTabBar();
});
onUnmounted(() => {
  uni.showTabBar();
});
const goBack = () => {
  if (!TABBARPATHLIST.includes(backPath.value)) {
    uni.navigateBack();
    return;
  }
  uni.$u.route({
    url: backPath.value,
    type: "switchTab",
  });
};

// 底部tabBar数据
const tabList = ref([
  {
    id: 0,
    name: "文字",
  },
  {
    id: 1,
    name: "相机",
  },
  { id: 2, name: "开直播" },
]);

// 点击返回箭头
const isSave = () => {
  isShowPopover.value = !isShowPopover.value
};

// 是否显示弹出层
const isShowPopover = ref(false)

</script>

<style lang="scss" scoped>
@import "./css/index.scss";
</style>
