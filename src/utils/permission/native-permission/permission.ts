/**
 * 本模块封装了Android、iOS的应用权限判断、请求及设置页跳转
 * 仅适用于 UniApp APP 端（Android/iOS）
 */

// 声明plus对象（UniApp原生扩展）
declare const plus: any;

/**
 * ios权限标识类型（对应Info.plist中的键）
 */
export type PermissionID =
  | "NSCameraUsageDescription" // 相机
  | "NSPhotoLibraryUsageDescription" // 读取相册
  | "NSPhotoLibraryAddUsageDescription" // 写入相册
  | "NSMicrophoneUsageDescription" // 麦克风
  | "NSNotificationSettings" // 推送
  | "NSContactsUsageDescription" // 通讯录
  | "NSCalendarsUsageDescription"; // 日历

// android权限标识类型
export type AndroidPermission =
  // 位置相关（危险权限）
  | "android.permission.ACCESS_FINE_LOCATION" // 精确位置（GPS等）
  | "android.permission.ACCESS_COARSE_LOCATION" // 粗略位置（网络等）
  | "android.permission.ACCESS_BACKGROUND_LOCATION" // 后台位置（Android 10+）

  // 相机（危险权限）
  | "android.permission.CAMERA"

  // 麦克风（危险权限）
  | "android.permission.RECORD_AUDIO"

  // 存储相关（危险权限，版本差异）
  | "android.permission.READ_EXTERNAL_STORAGE" // 读取外部存储（Android 10以下）
  | "android.permission.WRITE_EXTERNAL_STORAGE" // 写入外部存储（Android 10以下）
  | "android.permission.MANAGE_EXTERNAL_STORAGE" // 管理外部存储（Android 10+，需特殊申请）
  | "android.permission.ACCESS_MEDIA_LOCATION" // 读取媒体文件中的位置信息（Android 10+）

  // 电话相关（危险权限）
  | "android.permission.READ_PHONE_STATE" // 读取电话状态（如设备ID、信号等）
  | "android.permission.CALL_PHONE" // 直接拨打电话
  | "android.permission.ANSWER_PHONE_CALLS" // 接听电话（Android 8.0+）
  | "android.permission.READ_CALL_LOG" // 读取通话记录
  | "android.permission.WRITE_CALL_LOG" // 写入通话记录
  | "android.permission.ADD_VOICEMAIL" // 添加语音信箱

  // 联系人（危险权限）
  | "android.permission.READ_CONTACTS" // 读取联系人
  | "android.permission.WRITE_CONTACTS" // 写入联系人
  | "android.permission.GET_ACCOUNTS" // 获取账户列表

  // 短信（危险权限）
  | "android.permission.SEND_SMS" // 发送短信
  | "android.permission.RECEIVE_SMS" // 接收短信
  | "android.permission.READ_SMS" // 读取短信
  | "android.permission.RECEIVE_WAP_PUSH" // 接收WAP推送信息
  | "android.permission.RECEIVE_MMS" // 接收彩信

  // 传感器（危险权限）
  | "android.permission.BODY_SENSORS" // 访问身体传感器（如心率传感器）

  // 日历（危险权限）
  | "android.permission.READ_CALENDAR" // 读取日历
  | "android.permission.WRITE_CALENDAR" // 写入日历

  // 通知（危险权限，Android 13+）
  | "android.permission.POST_NOTIFICATIONS" // 发送通知（Android 13+）

  // 蓝牙（部分危险权限，Android 12+）
  | "android.permission.BLUETOOTH_SCAN" // 蓝牙扫描（Android 12+）
  | "android.permission.BLUETOOTH_ADVERTISE" // 蓝牙广播（Android 12+）
  | "android.permission.BLUETOOTH_CONNECT" // 蓝牙连接（Android 12+）
  | "android.permission.BLUETOOTH" // 旧版蓝牙权限（Android 11及以下）

  // 普通权限（仅需Manifest声明，无需动态申请）
  | "android.permission.INTERNET" // 网络访问
  | "android.permission.ACCESS_NETWORK_STATE" // 获取网络状态
  | "android.permission.CHANGE_NETWORK_STATE" // 改变网络状态
  | "android.permission.WAKE_LOCK" // 唤醒锁（防止休眠）
  | "android.permission.VIBRATE" // 震动权限
  | "android.permission.SYSTEM_ALERT_WINDOW" // 悬浮窗（需动态申请，特殊权限）
  | "android.permission.REQUEST_INSTALL_PACKAGES"; // 安装应用（需动态申请，特殊权限）

/**
 * Android权限请求结果类型
 */
export type AndroidPermissionResult =
  | 1 // 已获取权限
  | 0 // 拒绝本次申请
  | -1 // 永久拒绝申请
  | { code: number; message: string }; // 申请错误

// iOS系统标识（仅在APP环境下有效）
let isIos: boolean = false;

// #ifdef APP-PLUS
isIos = plus.os.name === "iOS";
// #endif

// ======================== iOS 权限处理 ========================
/**
 * iOS权限请求核心方法（通过原生API触发权限申请弹窗）
 * @param permissionID 权限标识（对应PermissionID类型）
 * @returns Promise<boolean> 是否获得权限
 */
function requestIosPermission(permissionID: PermissionID): Promise<boolean> {
  return new Promise((resolve) => {
    switch (permissionID) {
      case "NSCameraUsageDescription":
        // 请求相机权限
        const AVCaptureDevice = plus.ios.import("AVCaptureDevice");
        AVCaptureDevice.requestAccessForMediaTypeCompletionHandler(
          "video",
          (granted: boolean) => {
            resolve(granted);
            plus.ios.deleteObject(AVCaptureDevice);
          }
        );
        break;

      case "NSMicrophoneUsageDescription":
        // 请求麦克风权限
        const AVAudioSession = plus.ios.import("AVAudioSession");
        const session = AVAudioSession.sharedInstance();
        session.requestRecordPermission((granted: boolean) => {
          resolve(granted);
          plus.ios.deleteObject(session);
          plus.ios.deleteObject(AVAudioSession);
        });
        break;

      case "NSPhotoLibraryUsageDescription":
        // 读取相册权限
        const PHPhotoLibrary = plus.ios.import("PHPhotoLibrary");
        PHPhotoLibrary.requestAuthorization((status: number) => {
          resolve(status === 3); // 3表示已授权
          plus.ios.deleteObject(PHPhotoLibrary);
        });
        break;

      case "NSPhotoLibraryAddUsageDescription":
        // 写入相册权限（iOS 11+）
        const PhotoLibrary = plus.ios.import("PHPhotoLibrary");
        PhotoLibrary.requestAuthorization((status: number) => {
          // 写入权限依赖读取权限，需同时判断
          resolve(status === 3);
          plus.ios.deleteObject(PhotoLibrary);
        });
        break;

      case "NSContactsUsageDescription":
        // 通讯录权限
        const CNContactStore = plus.ios.import("CNContactStore");
        const contactStore = new CNContactStore();
        contactStore.requestAccessForEntityTypeCompletionHandler(
          0, // CNEntityType.Contacts
          (granted: boolean) => {
            resolve(granted);
            plus.ios.deleteObject(contactStore);
            plus.ios.deleteObject(CNContactStore);
          }
        );
        break;

      case "NSCalendarsUsageDescription":
        // 日历权限
        const EKEventStore = plus.ios.import("EKEventStore");
        const eventStore = new EKEventStore();
        eventStore.requestAccessToEntityTypeCompletionHandler(
          0, // EKEntityType.Event
          (granted: boolean) => {
            resolve(granted);
            plus.ios.deleteObject(eventStore);
            plus.ios.deleteObject(EKEventStore);
          }
        );
        break;

      case "NSNotificationSettings":
        // 推送权限（需通过注册推送触发，此处仅返回当前状态）
        resolve(judgeIosPermission(permissionID));
        break;

      default:
        console.warn(`未支持的iOS权限标识：${permissionID}`);
        resolve(false);
    }
  });
}

/**
 * iOS定位权限请求（优化版：使用事件监听替代固定延迟）
 * 监听权限状态变化事件，确保在用户操作完成后再获取结果
 */
function requestIosLocationPermission(): Promise<boolean> {
  return new Promise((resolve) => {
    // 导入iOS定位相关类
    const CLLocationManager = plus.ios.import("CLLocationManager");
    const cllocationManger = new CLLocationManager();

    // 定义权限状态变化的回调函数
    const onAuthorizationStatusChanged = () => {
      // 获取当前权限状态
      const status = cllocationManger.authorizationStatus();
      const isGranted = status !== 2; // 2表示未授权

      // 移除事件监听（避免重复触发）
      cllocationManger.removeObserverForKeyPathContext(
        observer,
        "authorizationStatus",
        null
      );

      // 清理原生对象，防止内存泄漏
      plus.ios.deleteObject(observer);
      plus.ios.deleteObject(cllocationManger);
      plus.ios.deleteObject(CLLocationManager);

      // 返回最终权限状态
      resolve(isGranted);
    };

    // 创建观察者（用于监听权限状态变化）
    const observer = plus.ios.importClass("NSObject");
    observer.addMethod(
      "locationManagerDidChangeAuthorizationStatus:",
      (args: any) => {
        // 触发权限检查
        onAuthorizationStatusChanged();
      },
      "v@:" // 方法签名：void (id, SEL)
    );

    // 添加观察者监听权限状态变化
    cllocationManger.addObserverForKeyPathOptionsContext(
      observer,
      "authorizationStatus",
      1 << 3, // NSKeyValueObservingOptionNew
      null
    );

    // 触发定位权限请求
    cllocationManger.requestWhenInUseAuthorization();

    // 兜底超时机制（防止极端情况下事件未触发）
    const timeoutTimer = setTimeout(() => {
      console.warn("定位权限请求超时，使用当前状态");
      onAuthorizationStatusChanged(); // 强制检查并清理
    }, 10000); // 10秒超时（足够用户完成操作）
  });
}

/**
 * 判断iOS推送权限是否开启
 */
function judgeIosPermissionPush(): boolean {
  let result = false;
  const UIApplication = plus.ios.import("UIApplication");
  const app = UIApplication.sharedApplication();
  let enabledTypes = 0;

  if (app.currentUserNotificationSettings) {
    const settings = app.currentUserNotificationSettings();
    enabledTypes = settings.plusGetAttribute("types");
    result = enabledTypes !== 0;
    plus.ios.deleteObject(settings);
  } else {
    enabledTypes = app.enabledRemoteNotificationTypes();
    result = enabledTypes !== 0;
  }

  console.log(`推送权限：${result ? "已开启" : "未开启"}`);
  plus.ios.deleteObject(app);
  plus.ios.deleteObject(UIApplication);
  return result;
}

/**
 * 判断iOS定位权限是否开启
 */
function judgeIosPermissionLocation(): boolean {
  const cllocationManger = plus.ios.import("CLLocationManager");
  const status = cllocationManger.authorizationStatus();
  const result = status !== 2; // 2表示未授权
  console.log(`定位权限：${result ? "已开启" : "未开启"}`);
  plus.ios.deleteObject(cllocationManger);
  return result;
}

/**
 * 判断iOS麦克风权限是否开启
 */
function judgeIosPermissionRecord(): boolean {
  const avaudiosession = plus.ios.import("AVAudioSession");
  const avaudio = avaudiosession.sharedInstance();
  const permissionStatus = avaudio.recordPermission();
  // 1684369017（未请求）、1970168948（已拒绝）
  const result = !(
    permissionStatus === 1684369017 || permissionStatus === 1970168948
  );
  console.log(`麦克风权限：${result ? "已开启" : "未开启"}`);
  plus.ios.deleteObject(avaudio);
  plus.ios.deleteObject(avaudiosession);
  return result;
}

/**
 * 判断iOS相机权限是否开启
 */
function judgeIosPermissionCamera(): boolean {
  const AVCaptureDevice = plus.ios.import("AVCaptureDevice");
  const authStatus = AVCaptureDevice.authorizationStatusForMediaType("video");
  const result = authStatus === 3; // 3表示已授权
  console.log(`相机权限：${result ? "已开启" : "未开启"}`);
  plus.ios.deleteObject(AVCaptureDevice);
  return result;
}

/**
 * 判断iOS相册权限是否开启
 */
function judgeIosPermissionPhotoLibrary(): boolean {
  const PHPhotoLibrary = plus.ios.import("PHPhotoLibrary");
  const authStatus = PHPhotoLibrary.authorizationStatus();
  const result = authStatus === 3; // 3表示已授权
  console.log(`相册权限：${result ? "已开启" : "未开启"}`);
  plus.ios.deleteObject(PHPhotoLibrary);
  return result;
}

/**
 * 判断iOS通讯录权限是否开启
 */
function judgeIosPermissionContact(): boolean {
  const CNContactStore = plus.ios.import("CNContactStore");
  const cnAuthStatus = CNContactStore.authorizationStatusForEntityType(0);
  const result = cnAuthStatus === 3;
  console.log(`通讯录权限：${result ? "已开启" : "未开启"}`);
  plus.ios.deleteObject(CNContactStore);
  return result;
}

/**
 * 判断iOS日历权限是否开启
 */
function judgeIosPermissionCalendar(): boolean {
  const EKEventStore = plus.ios.import("EKEventStore");
  const ekAuthStatus = EKEventStore.authorizationStatusForEntityType(0);
  const result = ekAuthStatus === 3;
  console.log(`日历权限：${result ? "已开启" : "未开启"}`);
  plus.ios.deleteObject(EKEventStore);
  return result;
}

/**
 * 根据权限ID判断iOS权限是否开启
 */
function judgeIosPermission(permissionID: PermissionID): boolean {
  switch (permissionID) {
    case "NSCameraUsageDescription":
      return judgeIosPermissionCamera();
    case "NSPhotoLibraryUsageDescription":
      return judgeIosPermissionPhotoLibrary();
    case "NSMicrophoneUsageDescription":
      return judgeIosPermissionRecord();
    case "NSNotificationSettings":
      return judgeIosPermissionPush();
    case "NSContactsUsageDescription":
      return judgeIosPermissionContact();
    case "NSCalendarsUsageDescription":
      return judgeIosPermissionCalendar();
    default:
      console.warn(`未支持的iOS权限标识：${permissionID}`);
      return false;
  }
}

// ======================== Android 权限处理 ========================
/**
 * 判断Android权限是否已开启
 * @param permissionID 原生权限字符串（如android.permission.CAMERA）
 * @returns boolean 是否已授权
 */
function judgeAndroidPermission(permissionID: AndroidPermission): boolean {
  const context = plus.android.runtimeMainActivity();
  const PackageManager = plus.android.importClass(
    "android.content.pm.PackageManager"
  );
  const result =
    context.checkSelfPermission(permissionID) ===
    PackageManager.PERMISSION_GRANTED;
  console.log(context.checkSelfPermission(permissionID), "系统");

  console.log(`Android权限[${permissionID}]：${result ? "已开启" : "未开启"}`);
  return result;
}

/**
 * Android权限请求
 * @param permissionID 原生权限字符串
 * @returns Promise<boolean> 请求结果
 */
function requestAndroidPermission(
  permissionID: AndroidPermission
): Promise<boolean> {
  return new Promise((resolve) => {
    // #ifdef APP-PLUS
    plus.android.requestPermissions(
      [permissionID],
      (resultObj: any) => {
        let result: boolean = false;

        if (resultObj.granted.length > 0) {
          // result = 1;
          result = true;
          resultObj.granted.forEach((perm: string) => {
            console.log(`已获取Android权限：${perm}`);
          });
        } else if (resultObj.deniedAlways.length > 0) {
          // result = -1;
          result = false;
          resultObj.deniedAlways.forEach((perm: string) => {
            console.log(`永久拒绝Android权限：${perm}`);
          });
        } else if (resultObj.deniedPresent.length > 0) {
          // result = 0;
          result = false;
          resultObj.deniedPresent.forEach((perm: string) => {
            console.log(`临时拒绝Android权限：${perm}`);
          });
        }

        resolve(result);
      },
      (error: any) => {
        console.error(`Android权限请求错误：${error.message}`);
        resolve(false);
      }
    );
    // #endif
  });
}

// ======================== 通用方法 ========================
/**
 * 跳转到应用权限设置页 (当安卓或ios端，请求结果状态为拒绝（安卓端永久拒绝时）的时候，组件中引导用户去设置的按钮，会使用到这个方法)
 */
function gotoAppPermissionSetting(): void {
  // #ifdef APP-PLUS
  if (isIos) {
    const UIApplication = plus.ios.import("UIApplication");
    const app = UIApplication.sharedApplication();
    const NSURL = plus.ios.import("NSURL");
    const url = NSURL.URLWithString("app-settings:");
    app.openURL(url);
    plus.ios.deleteObject(url);
    plus.ios.deleteObject(NSURL);
    plus.ios.deleteObject(app);
    plus.ios.deleteObject(UIApplication);
  } else {
    const Intent = plus.android.importClass("android.content.Intent");
    const Settings = plus.android.importClass("android.provider.Settings");
    const Uri = plus.android.importClass("android.net.Uri");
    const mainActivity = plus.android.runtimeMainActivity();
    const intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
    intent.setData(
      Uri.fromParts("package", mainActivity.getPackageName(), null)
    );
    mainActivity.startActivity(intent);
  }
  // #endif
}

/**
 * 检查系统定位服务是否开启（硬件级开关）
 * @returns boolean 是否开启
 */
function checkSystemEnableLocation(): boolean {
  // #ifdef APP-PLUS
  if (isIos) {
    const CLLocationManager = plus.ios.import("CLLocationManager");
    const result = CLLocationManager.locationServicesEnabled();
    plus.ios.deleteObject(CLLocationManager);
    console.log(`iOS系统定位服务：${result ? "已开启" : "未开启"}`);
    return result;
  } else {
    const Context = plus.android.importClass("android.content.Context");
    const LocationManager = plus.android.importClass(
      "android.location.LocationManager"
    );
    const mainActivity = plus.android.runtimeMainActivity();
    const locationManager = mainActivity.getSystemService(
      Context.LOCATION_SERVICE
    ) as any;
    const result = locationManager.isProviderEnabled(
      LocationManager.GPS_PROVIDER
    );
    console.log(`Android系统定位服务：${result ? "已开启" : "未开启"}`);
    return result;
  }
  // #endif
  return false;
}

/**
 * 跨平台权限请求统一入口
 * @param permissionID 权限标识（iOS用PermissionID，Android用AndroidPermission）
 * @returns Promise<boolean> 最终是否获得权限
 */
async function requestPermission(
  permissionID: PermissionID | AndroidPermission
): Promise<boolean> {
  if (isIos) {
    // iOS流程：先判断，未授权则请求
    // if (judgeIosPermission(permissionID as PermissionID)) return true;
    return await requestIosPermission(permissionID as PermissionID);
  } else {
    // if (judgeAndroidPermission(permissionID as AndroidPermission)) return true;
    const result = await requestAndroidPermission(
      permissionID as AndroidPermission
    );
    return result;
  }
}

// 判断权限是否开启（通用）
async function judgePermission(
  permissionID: PermissionID | AndroidPermission
): Promise<boolean> {
  let result: boolean;
  if (isIos) {
    result = judgeIosPermission(permissionID as PermissionID);
  } else {
    result = judgeAndroidPermission(permissionID as AndroidPermission);
  }
  return result;
}

// 导出完整接口
export const nativePermission = {
  // 平台通用方法
  requestPermission, // 统一权限请求入口
  gotoAppPermissionSetting,
  checkSystemEnableLocation,
  judgePermission,

  // iOS专用方法
  judgeIosPermission,
  requestIosPermission,
  requestIosLocationPermission, // 补充导出定位权限专用请求方法

  // Android专用方法
  judgeAndroidPermission,
  requestAndroidPermission,
};
