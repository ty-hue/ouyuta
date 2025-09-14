<!-- <template>
  <up-tabbar
    :value="currentIndex"
    @change="change"
    :fixed="true"
    :placeholder="true"
    :safeAreaInsetBottom="true"
    activeColor="#F54B64"
    inactiveColor="#4E586E"
    :customStyle="{
      backgroundColor: '#20242F',
      fontWeight: '900',
      paddingTop: '4px',
      boxSizing: 'border-box',
      height:'100rpx'
    }"
  >
    <up-tabbar-item
      :text="tabBarItem.text"
      v-for="tabBarItem in tabBarList"
      :key="tabBarItem.id"
      :badge="tabBarItem.num"
    >
      <template #active-icon>
        <i :class="['iconfont', 'active', tabBarItem.iconClassName]"></i>
      </template>
      <template #inactive-icon>
        <i :class="['iconfont', tabBarItem.iconClassName]"></i>
      </template>
    </up-tabbar-item>
  </up-tabbar>
</template>

<script setup lang="ts">
import { useTabbarListStore } from "@/store/useTabbarListStore";
import { storeToRefs } from "pinia";
const tabBarStore = useTabbarListStore();
const { tabBarList, currentIndex } = storeToRefs(tabBarStore);

const { setCurrentIndex } = tabBarStore;
const change = (current: number) => {
  uni.$u.route({
    url: tabBarList.value[current].path,
    type: 'switchTab',
  });
  setCurrentIndex(current);
};
</script>

<style scoped lang="scss">
@import "./css/index.scss";
</style> -->
