import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { loginApi, whoamiApi } from "@/request/apis/user";
import type { LoginApiParamType } from "@/types/apiParamTypes";
import { TOKEN, INFO } from "@/const/sysConst";
// 定义状态结构类型
interface UserInfoType {
  name: string;
  age: number;
  mobile: string;
  sex: boolean;
  avatarUrl: string;
}

export const useUserInfoStore = defineStore(
  "userInfo",
  () => {
    // 初始化符合UserInfoState类型的响应式对象
    // reactive会返回Proxy对象，自动具备响应式能力
    let info = ref<UserInfoType | null>(null);
    const token = ref<string>("");
    // 设置token
    const setToken = (value: string) => {
      token.value = value;
      uni.setStorageSync(TOKEN, token.value);
    };
    // 设置info(用户信息)
    const setInfo = (infoObj: UserInfoType) => {
      info.value = infoObj;
      uni.setStorageSync(INFO, JSON.stringify(info.value));
    };
    // 异步登陆
    const login = async (params: LoginApiParamType) => {
      try{
        const { token } = await loginApi(params);
        setToken(token);
        await whoami();
      }catch(e){
        
      }
    };
    // 异步获取用户信息
    const whoami = async () => {
      const info = await whoamiApi();
      setInfo(info);
    };

    // 返回状态和方法
    return {
      info,
      token, // 解构状态，方便组件直接访问userInfo
      login,
    };
  }, // 第三个参数：持久化配置（setup语法专用）
  // {
  //   persist: {
  //     enabled: true, // 开启持久化
  //     strategies: [
  //       {
  //         key: INFO, // 自定义存储的key（默认是store的id）
  //         paths: ["info"], // 指定需要持久化的字段（默认持久化所有返回的状态）
  //       },
  //       {
  //         key: TOKEN,
  //         paths: ["token"],
  //       },
  //     ],
  //   },
  // }
);
