
// H5 端权限处理函数（单独封装）
export const h5Permission = {
  // H5 相机权限
  requestCamera: async (): Promise<boolean> => {
    console.log('xxxxgf');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((track) => track.stop());
      return true;
    } catch (err) {
      console.log(err)
      if ((err as Error).name === "NotAllowedError") {
        uni.showModal({
          title: "权限不足",
          content: "请点击浏览器地址栏的「锁」图标，开启相机权限",
          showCancel: false,
        });
      }
      return false;
    }
  },
  // H5 麦克风权限
  requestMicrophone: async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      return true;
    } catch (err) {
      if ((err as Error).name === "NotAllowedError") {
        uni.showModal({
          title: "权限不足",
          content: "请点击浏览器地址栏的「锁」图标，开启麦克风权限",
          showCancel: false,
        });
      }
      return false;
    }
  },
  // 获取读取相册权限，注意h5端默认是直接允许读取相册的， <input type="file"> 由用户主动选择文件，无需提前申请权限（浏览器默认允许），所以为了保证格式统一，我们这里还是写一个方法，方法直接返回true
  requestReadPhotoPermission: async (): Promise<boolean> => {
    return true;
  },
  // 获取写入相册权限，注意h5端默认是直接允许写入相册的， <input type="file"> 由用户自动保存图片到相册，无需提前申请权限（浏览器默认允许），所以为了保证格式统一，我们这里还是写一个方法，方法直接返回true
  requestWritePhotoPermission: async (): Promise<boolean> => {
    return true;
  },
};
