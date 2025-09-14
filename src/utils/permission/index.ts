import { nativePermission } from "./native-permission/permission";
import { h5Permission } from "./h5-permission/permission";
import type {
  PermissionID,
  AndroidPermission,
} from "./native-permission/permission";
import { wxPermission } from "./wx-permission/permission";
import type { WechatScope } from "./wx-permission/permission";
export type PermissionIdType =
  | PermissionID
  | AndroidPermission
  | WechatScope
  | "";
// 获取系统信息（同步方法）
const systemInfo = uni.getSystemInfoSync();
// 平台标识（关键属性）
const platform = systemInfo.platform;
export const permission = {
  requestPermission: async (
    permissionId: PermissionIdType
  ): Promise<boolean> => {
    let result: boolean;
    // #ifdef APP-PLUS
    result = await nativePermission.requestPermission(
      permissionId as PermissionID | AndroidPermission
    );
    // #endif
    // #ifdef MP-WEIXIN
    result = await wxPermission.requestPermission(permissionId as WechatScope);
    // #endif
    return result;
  },
  judgePermission: async (permissionId: PermissionIdType): Promise<boolean> => {
    let result: boolean;
    // #ifdef APP-PLUS
    result = await nativePermission.judgePermission(
      permissionId as PermissionID | AndroidPermission
    );
    // #endif
    // #ifdef MP-WEIXIN
    result = await wxPermission.checkPermission(permissionId as WechatScope);
    // #endif
    return result;
  },
  // 全平台获取相机权限方法
  requestCameraPermission: async (): Promise<
    boolean
  > => {
    console.log(platform);

    // 单独处理h5
    if (process.env.VUE_APP_PLATFORM === "h5") {
      return await h5Permission.requestCamera();
    }
    let permissionId: PermissionIdType;
    switch (platform) {
      case "android":
        permissionId = "android.permission.CAMERA";
        break;
      case "ios":
        permissionId = "NSCameraUsageDescription";
        break;
      case "devtools":
        permissionId = "scope.camera";
        break;
      default:
        return false;
    }
    return await permission.requestPermission(permissionId);
  },
  // 全平台获取麦克风权限方法
  requestRecordPermission: async (): Promise<
    boolean
  > => {
    // 单独处理h5
    if (process.env.VUE_APP_PLATFORM === "h5") {
      return await h5Permission.requestMicrophone();
    }
    let permissionId: PermissionIdType;
    switch (platform) {
      case "android":
        permissionId = "android.permission.RECORD_AUDIO";
        break;
      case "ios":
        permissionId = "NSMicrophoneUsageDescription";
        break;
      case "devtools":
        permissionId = "scope.record";
        break;
      default:
        return false;
    }

    return await permission.requestPermission(permissionId);
  },
  // 安卓和ios获取读取相册权限方法 （微信小程序，没有提供获取相册的权限标识，它是直接通过wx.chooseImage 或 wx.chooseVideo 等 API 直接触发系统授权流程，用户首次使用时会自动弹出授权弹窗）
  requestReadPhotoPermission: async (): Promise<
    boolean
  > => {
    if (platform === "mp-weixin") {
      return false;
    }
    // 单独处理h5
    if (process.env.VUE_APP_PLATFORM === "h5") {
      return await h5Permission.requestReadPhotoPermission();
    }
    let permissionId: PermissionIdType;
    switch (platform) {
      case "android":
        permissionId = "android.permission.READ_EXTERNAL_STORAGE";
        break;
      case "ios":
        permissionId = "NSPhotoLibraryUsageDescription";
        break;
      default:
        return false;
    }
    return await permission.requestPermission(permissionId);
  },
  // 全平台获取写入相册权限方法
  requestWritePhotoPermission: async (): Promise<
    boolean
  > => {
    // 单独处理h5
    if (process.env.VUE_APP_PLATFORM === "h5") {
      return await h5Permission.requestWritePhotoPermission();
    }
    let permissionId: PermissionIdType;
    switch (platform) {
      case "android":
        permissionId = "android.permission.WRITE_EXTERNAL_STORAGE";
        break;
      case "ios":
        permissionId = "NSPhotoLibraryAddUsageDescription";
        break;
      case "mp-weixin":
        permissionId = "scope.writePhotosAlbum";
        break;
      default:
        return false;
    }
    return await permission.requestPermission(permissionId);
  },
};

// 获取权限，我们已经封装好了，使用方法如下：
/**
 * 1.直接使用 例如：requestWritePhotoPermission已经封装好了的，获取某个权限的方法，十分方便。绑定为组件的某个按钮的事件即可。
 * 2.当我们在组件中点击按钮触发了申请权限的逻辑，我们可以拿到用户到底是拒绝了还是允许了的状态
 * 3.这个状态需要注意：安卓端的时候，请求权限的状态是数字，分别是1(允许) -1(永久拒绝) 0(临时拒绝)      而在ios和微信小程序端则为布尔值：true代表允许 false代表永久拒绝
 * 4.为什么安卓端返回结果是数字呢？
 * 这是因为安卓端 有三种状态：分别是 允许 临时拒绝 永久拒绝不在询问   ，而ios和小程序端则只有两种状态，允许和永久拒绝
 * 那么我们再判断什么时候需要出现 引导用户跳转到权限设置页的时候，就有用了，因为安卓端只有-1永久拒绝时，才需要出现这个引导按钮（临时拒绝，再次点击申请权限是依旧可以弹出权限交互框的,不需要显示引导按钮），而小程序端和ios端因为只有两种状态所以false时就需要出现引导按钮。
 *
 *
 * // 由于之前忘记了考虑h5。实际上h5非常简单，它的读写相册是无需权限的，麦克风和相机是在手动调用对应api时，浏览器手动触发权限弹框的。我这里给每个申请权限的方法都加上了h5获取权限的补丁。
 */
