/**
 * 微信小程序权限标识类型（自动关联AuthSetting的所有key）
 * 无需手动维护联合类型，新增权限只需扩展上面的AuthSetting
 */
export type WechatScope = keyof UniApp.AuthSetting;

/**
 * 微信小程序权限工具类
 */
export const wxPermission = {
  /**
   * 检查指定权限的授权状态
   */
  checkPermission: (scope: WechatScope): Promise<boolean> => {
    return new Promise((resolve) => {
      uni.getSetting({
        success: (res) => {
          // 此时scope与AuthSetting的key完全匹配，类型安全
          resolve(!!res.authSetting[scope]);
        },
        fail: () => {
          resolve(false);
        },
      });
    });
  },

  /**
   * 申请指定权限
   */
  requestPermission: async (scope: WechatScope): Promise<boolean> => {                
      return new Promise((resolve) => {
        uni.authorize({
          scope,
          success: () => {
            resolve(true);
          },
          fail: () => {
            resolve(false);
          },
        });
      });
  },

  /**
   * 引导用户到设置页开启权限   (当微信小程序端，请求结果状态为拒绝的时候，组件中引导用户去设置的按钮，会使用到这个方法)
   */
  guideToSetting: (desc: string) => {
      uni.showModal({
        title: "权限申请",
        content: `需要${desc}才能使用该功能，请在设置中开启`,
        confirmText: "去设置",
        cancelText: "取消",
        success: (modalRes) => {
          if (modalRes.confirm) {
            uni.openSetting();
          } 
        },
        fail: () => {
          
        },
      });
  },
};
