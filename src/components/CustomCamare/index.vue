<template>
  <view
    class="custom-camera-container"
    :style="{ height: cameraHeight + 'px', width: 750 + 'rpx' }"
  >
    <KJ-Camera
      v-if="!photoPath && !videoPath"
      ref="cameraRef"
      class="KJ-Camera"
      :style="{ width: 750 + 'rpx', height: cameraHeight + 'px' }"
    >
    </KJ-Camera>
    <image
      :style="{ height: cameraHeight + 'px', width: 750 + 'rpx' }"
      v-else-if="photoPath"
      :src="photoPath"
      mode="scaleToFill"
    ></image>
    <!-- 录制完成后播放视频 -->
    <video
      v-else
      :src="videoPath"
      :controls="true"
      :autoplay="true"
      :show-fullscreen-btn="false"
      object-fit="fill"
      :loop="true"
      :style="{ width: 750 + 'rpx', height: cameraHeight + 'px' }"
    ></video>
    <CloseButton />
    <AsideControlMenu
      @flip="switchCamera"
      @flash="setFlash"
      @setting="setting"
    />
    <BottomControl
      @startVideoCapture="startVideoCapture"
      @stopVideoCapture="stopVideoCapture"
      @captureImage="captureImage"
    />
    <ChooseMusic />
    <view class="setting-sheet-container">
      <up-action-sheet
        :show="isShowSheet"
        @close="isShowSheet = false"
        :round="30"
        :safe-area-inset-bottom="true"
      >
        <view class="setting-sheet-content">
          <view class="setting-sheet-item">
            <view class="sheet-item-left">
              <cover-image
                src="./../../static/createIcons/setting-duration.png"
                class="sheet-item-icon"
              ></cover-image>
              <text class="sheet-item-text">最大拍摄时长（秒）</text>
            </view>
            <view class="sheet-item-right">
              <Subsection
                container-id="tangyang"
                :list="durationList"
                :current="curDuration"
                @change="handleDuraionSectionChange"
              />
            </view>
          </view>
          <view class="setting-sheet-item">
            <view class="sheet-item-left">
              <cover-image
                src="./../../static/createIcons/setting-proportion.png"
                class="sheet-item-icon"
              ></cover-image>
              <text class="sheet-item-text">拍摄比例</text>
            </view>
            <view class="sheet-item-right">
              <Subsection
                container-id="llg"
                :custom-style="{ width: '200rpx' }"
                :list="proportionList"
                :current="curProportion"
                @change="handleProportionSectionChange"
              />
            </view>
          </view>
          <view class="setting-sheet-item">
            <view class="sheet-item-left">
              <cover-image
                src="./../../static/createIcons/setting-camare.png"
                class="sheet-item-icon"
              ></cover-image>
              <text class="sheet-item-text">使用音量键拍摄</text>
            </view>
            <view class="sheet-item-right">
              <up-switch
                activeColor="#33E088"
                inactiveColor="#333334"
                v-model="isUseVoluem"
                @change="handleUseVoluemChange"
              ></up-switch>
            </view>
          </view>
          <view class="setting-sheet-item">
            <view class="sheet-item-left">
              <cover-image
                src="./../../static/createIcons/setting-grid.png"
                class="sheet-item-icon"
              ></cover-image>
              <text class="sheet-item-text">网格</text>
            </view>
            <view class="sheet-item-right">
              <up-switch
                activeColor="#33E088"
                inactiveColor="#333334"
                v-model="isUseGrid"
                @change="handleUseGridChange"
              ></up-switch>
            </view>
          </view>
          <view class="pendant">
            <view class="content"></view>
          </view>
        </view>
      </up-action-sheet>
    </view>
    <MusicSheet />
    <SearchMusicSheet/>
  </view>
</template>

<script lang="ts" setup>
import AsideControlMenu from "./comp/AsideControlMenu.vue";
import BottomControl from "./comp/BottomControl.vue";
import ChooseMusic from "./comp/ChooseMusic.vue";
import CloseButton from "./comp/CloseButton.vue";
import { onMounted, reactive, ref } from "vue";
import type { CameraInsType } from "@/types/nativeCameraRefType";
import { FlashValueType } from "@/types/enums";
import Subsection from "./../Subsection/index.vue";
import MusicSheet from "./../MusicSheet/index.vue";
import bus from "@/utils/bus";
import SearchMusicSheet from '@/components/SearchMusicSheet/index.vue'
const props = defineProps({
  cameraHeight: {
    type: Number,
    required: true,
  },
  cameraWidth: {
    type: Number,
    required: true,
  },
});
var videoFilePath: string; // 视频文件路径
const src = ref("");
const isShow = ref(false); // //解决刚打开页面卡顿的情况
const windowHeight = ref(0);
const windowWidth = ref(0);
const isVolume = ref(true);
const cameraRef = ref<CameraInsType | null>(null); // 相机示例
const photoPath = ref(""); // 刚拍完的照片文件位置
const videoPath = ref(""); // 刚拍完的视频文件位置
// #ifdef APP-NVUE
onMounted(() => {
  // 因为闪光灯默认是auto，但是我们的需求是刚开始是off，所有这里需要在组件初次挂载后重置一下
  setFlash(FlashValueType.OFF);
  // 设置相机参数
  android_setCameraParams();
});
// #endif
// 初始化相机，默认加载时已经初始化，该方法用于在旋转相机时使用，用于重置相机
const initCamera = () => {
  cameraRef.value!.initCamera();
};
// 拍照
const captureImage = () => {
  const dic = {
    savePath: plus.io.convertLocalFileSystemURL("_doc/KJ-Camera"), //保存图片位置，一定要是_doc绝对路径
    format: "jpeg", //保存的图片格式 有效值：png、jpeg
    quality: 80, //andorid才可用 保存的图片质量，取值1-100
    timeInterval: 0, //如果遇到黑照片，可以延时拍照，经过测试，已经没有黑照片，可以不用延时
  };
  cameraRef.value!.captureImage(
    dic,
    (res) => {
      console.log("filePath: " + res);
      uni.saveImageToPhotosAlbum({
        filePath: plus.io.convertAbsoluteFileSystem(res.filePath),
        success: function () {
          photoPath.value = plus.io.convertAbsoluteFileSystem(res.filePath);
          console.log(photoPath.value, "刚刚拍完照片的路径");
        },
        fail: function (e) {
          console.log(JSON.stringify(e));
        },
      });
    },
    (res) => {
      src.value = "data:image/png;base64," + res.base64;
      console.log("base64: " + res);
    }
  );
};

// 开始录像
const startVideoCapture = () => {
  /**
   * 注意：videoEncoder和audioEncoder最好设置为0，要不有些手机不支持，就录制不知了
   * */
  const dic = {
    savePath: plus.io.convertLocalFileSystemURL("_doc/KJ-Camera"), //保存视频位置，一定要是_doc绝对路径
    isAddAudio: true, //是否添加音频，默认是true
    videoEncoder: 2, //andorid有效,视频编码,DEFAULT = 0;H263 = 1;H264 = 2;MPEG_4_SP = 3;VP8 = 4;HEVC = 5;
    audioEncoder: 3, //andorid有效,音频编码,DEFAULT = 0;AMR_NB = 1;AMR_WB = 2;AAC = 3;HE_AAC = 4;AAC_ELD = 5;VORBIS = 6;
    timeInterval: 0, //如果遇到首帧有暗视频，可以延时拍照，经过测试，已经没有首帧有暗视频，可以不用延时
  };
  cameraRef.value!.startVideoCapture(dic, (res) => {
    console.log("startVideoCapture: " + JSON.stringify(res));
    if (res.status == "start") {
      console.log("开始录像");
    } else if (res.status == "end") {
      console.log("结束录像");
      videoFilePath = res.filePath;
      uni.saveVideoToPhotosAlbum({
        filePath: plus.io.convertAbsoluteFileSystem(videoFilePath),
        success: function () {
          console.log("这个函数执行了");
          videoPath.value = plus.io.convertAbsoluteFileSystem(videoFilePath);
          console.log(videoPath.value, "刚刚录制完的视频路径");
        },
      });
    }
  });
};
// 停止录像
const stopVideoCapture = () => {
  cameraRef.value!.stopVideoCapture();
};
const android_getCameras = () => {
  cameraRef.value!.android_getCameras((res) => {
    console.log("android_getCameras：" + JSON.stringify(res));
  });
};
// 前后摄像头切换
const switchCamera = () => {
  cameraRef.value!.switchCamera({
    //cameraId: 1 //andoird有效，通过android_getCameras获取，不填写，默认前后摄像头切换
  });
  android_setCameraParams(); //因为andorid前后摄像头，设置相机参数不一样，需要重置
};
// 设置焦距
const setZoomFactor = () => {
  cameraRef.value!.getZoomFactor((res_zoom) => {
    console.log("获取当前焦距：" + res_zoom.value);
    cameraRef.value!.getMaxZoomFactor((res_max) => {
      console.log("可设置的最大焦距：" + res_max.value);
      cameraRef.value!.getMinZoomFactor((res_min) => {
        console.log("可设置的最小焦距：" + res_min.value);
        cameraRef.value!.setZoomFactor(res_max.value);
      });
    });
  });
};
// 设置闪光灯
/**
 * 设置手电筒  默认是auto
 * auto-自动
 * on-开
 * off-关
 * */
const setFlash = (flag: FlashValueType) => {
  cameraRef.value!.setFlash(flag);
};
// 设置手电筒
const setTorch = () => {
  cameraRef.value!.setTorch("on");
};

// ios获取支持的分辨率
const ios_getSessionPresets = () => {
  cameraRef.value!.ios_getSessionPresets((res) => {
    console.log("ios_getSessionPresets：" + JSON.stringify(res));
  });
};
// ios设置分辨率
const ios_setSessionPreset = () => {
  cameraRef.value!.ios_setSessionPreset("low"); //从ios_getSessionPresets方法获取
};
// 安卓获取照片支持分辨率列表
const android_getSupportedPictureSizes = () => {
  cameraRef.value!.android_getSupportedPictureSizes((res) => {
    console.log("android_getSupportedPictureSizes：" + JSON.stringify(res));
  });
};
// 安卓获取支持预览分辨率列表
const android_getSupportedPreviewSizes = () => {
  cameraRef.value!.android_getSupportedPreviewSizes((res) => {
    console.log("android_getSupportedPreviewSizes：" + JSON.stringify(res));
  });
};
// 安卓获取视频支持分辨率列表
const android_getSupportedVideoSizes = () => {
  cameraRef.value!.android_getSupportedVideoSizes((res) => {
    console.log("android_getSupportedVideoSizes：" + JSON.stringify(res));
  });
};
// 安卓设置旋转角度
const setRotation = () => {
  cameraRef.value!.setRotation(null);
};
// 安卓设置相机参数
const android_setCameraParams = () => {
  const sysInfo = uni.getSystemInfoSync();
  const previewWidth = 750; // 你的预览宽度 rpx，实际渲染时会转换成 px
  const previewHeight = props.cameraHeight; // 你的预览高度 px

  cameraRef.value!.android_getSupportedPictureSizes((pictureSizes) => {
    cameraRef.value!.android_getSupportedPreviewSizes((previewSizes) => {
      cameraRef.value!.android_getSupportedVideoSizes((videoSizes) => {
        // 1️⃣ 获取照片最大分辨率
        let maxPicture = pictureSizes[0];
        pictureSizes.forEach((item: any) => {
          if (item.width * item.height > maxPicture.width * maxPicture.height) {
            maxPicture = item;
          }
        });

        // 2️⃣ 获取视频最大分辨率
        let maxVideo = videoSizes[0];
        videoSizes.forEach((item: any) => {
          if (item.width * item.height > maxVideo.width * maxVideo.height) {
            maxVideo = item;
          }
        });

        // 3️⃣ 匹配预览区域比例的最大预览分辨率
        const targetRatio =
          Math.round((previewHeight / previewWidth) * 100) / 100;
        let selectedPreview = previewSizes[0];
        let maxArea = 0;
        previewSizes.forEach((item: any) => {
          const ratio = Math.round((item.height / item.width) * 100) / 100;
          if (ratio === targetRatio) {
            const area = item.width * item.height;
            if (area > maxArea) {
              maxArea = area;
              selectedPreview = item;
            }
          }
        });

        // 4️⃣ 计算视频码率
        const videoBitrate = Math.floor(maxVideo.width * maxVideo.height * 5); // 经验值: 5倍分辨率像素

        const cameraParams = {
          picSizeWidth: maxPicture.width,
          picSizeHeight: maxPicture.height,
          jpegQuality: 100,
          preSizeWidth: selectedPreview.width,
          preSizeHeight: selectedPreview.height,
          videoSizeWidth: maxVideo.width,
          videoSizeHeight: maxVideo.height,
          videoEncodingBitRate: videoBitrate,
        };

        cameraRef.value!.android_setCameraParams(cameraParams);
        console.log("设置相机参数：", JSON.stringify(cameraParams));
      });
    });
  });
};

const setFPS = () => {
  //注意：慢动作视频，只能在相册里才能看出来效果，其它播放器看不出效果
  cameraRef.value!.setFPS({
    fps: 240, //正常是30
  });
};
const setAutoFPS = () => {
  cameraRef.value!.setAutoFPS();
};
// 设置
const setting = () => {
  console.log("点击了设置");
};
const isShowSheet = ref(false);
const openSettingSheet = () => {
  isShowSheet.value = true;
};
bus.on("openSettingSheet", openSettingSheet);
const curDuration = ref(0);
const durationList = reactive([
  { id: 0, name: "15" },
  { id: 1, name: "60" },
  { id: 2, name: "180" },
]);
const handleDuraionSectionChange = (id: number) => {
  curDuration.value = id;
};
const curProportion = ref(0);
const proportionList = reactive([
  { id: 0, name: "9:16" },
  { id: 1, name: "3:4" },
]);
const handleProportionSectionChange = (id: number) => {
  curProportion.value = id;
};
const isUseVoluem = ref(false);
const isUseGrid = ref(false);
const handleUseVoluemChange = (e: any) => {};
const handleUseGridChange = (e: any) => {};
</script>

<style scoped lang="scss">
.custom-camera-container {
  position: relative;
  .setting-sheet-container {
    .setting-sheet-content {
      position: relative;
      padding: 70rpx 30rpx 30rpx 30rpx;
      border-top-left-radius: 30rpx;
      border-top-right-radius: 30rpx;
      width: 750rpx;
      background-color: #262626;
      .setting-sheet-item {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 36rpx;
        .sheet-item-left {
          display: flex;
          flex-direction: row;
          align-items: center;
          .sheet-item-icon {
            width: 40rpx;
            height: 40rpx;
            margin-right: 16rpx;
          }
          .sheet-item-text {
            color: #fff;
            font-size: 30rpx;
          }
        }
      }
      .pendant {
        position: absolute;
        top: 0;
        left: 0;
        width: 750rpx;
        height: 40rpx;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        .content {
          width: 90rpx;
          height: 10rpx;
          border-radius: 20rpx;
          background: #515151;
        }
      }
    }
  }
}
</style>
