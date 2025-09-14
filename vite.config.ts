// vite.config.js
import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        // 全局注入 uview-plus 的变量文件（路径根据实际情况调整）
        additionalData: `@import "uview-plus/theme.scss";`,
		    quietDeps: true
      },
    },
    postcss: {
      plugins: [],
    },
  },
  plugins: [uni()],
});
