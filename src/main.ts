import { createSSRApp } from "vue";
import { createPinia } from "pinia";
import piniaPersistUni from "pinia-plugin-persist-uni"; // 导入插件
import App from "./App.vue";
import uviewPlus from "uview-plus";

export function createApp() {
  const app = createSSRApp(App);
  const pinia = createPinia();

  // 安装插件:持久化仓库数据
  pinia.use(piniaPersistUni);

  app.use(pinia);

  app.use(uviewPlus);

  return { app };
}




