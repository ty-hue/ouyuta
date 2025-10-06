<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import { TOKEN } from "./const/sysConst";
onLaunch(() => {    
  if (!uni.getStorageSync(TOKEN)) {
    uni.reLaunch({ url: "/pages/welcome/index" });
  }
});
onShow(() => {
  console.log("App Show");
});

onHide(() => {
  console.log("App Hide");
});
</script>
<style lang="scss">
@import "./style.scss";
@import "uview-plus/index.scss";
@font-face {
  font-family: "iconfont"; /* Project id 5018449 */
  src: url("https://at.alicdn.com/t/c/font_5018449_h6px6l6ia6.woff2?t=1757521834119")
      format("woff2"),
    url("https://at.alicdn.com/t/c/font_5018449_h6px6l6ia6.woff?t=1757521834119")
      format("woff"),
    url("https://at.alicdn.com/t/c/font_5018449_h6px6l6ia6.ttf?t=1757521834119")
      format("truetype");
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-tianjia:before {
  content: "\e664";
}

.icon-return:before {
  content: "\e600";
}

.icon-tupianshixiao:before {
  content: "\e687";
}

.icon-quxiao:before {
  content: "\e64e";
}

.icon-yinle:before {
  content: "\e72a";
}

.icon-fanzhuan:before {
  content: "\e609";
}
</style>
