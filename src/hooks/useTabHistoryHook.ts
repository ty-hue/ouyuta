import { useTabHistoryStore } from "@/store/useTabHistoryStore";
import {storeToRefs} from 'pinia'
import {onShow} from '@dcloudio/uni-app'
export default () => {
  const store = useTabHistoryStore();
  const {backPath} = storeToRefs(store)
  const { setTabHistory } = store;
  const pages = getCurrentPages();
  onShow(()=>{
    setTabHistory(pages[0].route!);
  })
  return {
    backPath
  }
};
