import { defineStore } from "pinia";

import { computed, ref } from "vue";
import { TABBAR_HISTORY } from "@/const/sysConst";
export const useTabHistoryStore = defineStore(
  "tabHistory",
  () => {
    const tabHistory = ref<string[]>([]);

    const setTabHistory = (path: string) => {
      if (path === tabHistory.value[0]) {
        return;
      }
      tabHistory.value.unshift(path);
      if (tabHistory.value.length > 2) {
        tabHistory.value.length = 2;
      }
      uni.setStorageSync(TABBAR_HISTORY, JSON.stringify(tabHistory.value));
      console.log(tabHistory.value, "x");
    };
    const backPath = computed(() => {
      if (tabHistory.value.length === 2) {
        return tabHistory.value[1];
      }
      return "";
    });
    return {
      tabHistory,
      setTabHistory,
      backPath,
    };
  },
  {
    persist: {
      enabled: true, // 开启持久化
      strategies: [
        {
          key: TABBAR_HISTORY, // 自定义存储的key（默认是store的id）
          paths: ["tabHistory"], // 指定需要持久化的字段（默认持久化所有返回的状态）
        },
      ],
    },
  }
);
