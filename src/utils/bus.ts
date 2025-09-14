// utils/bus.ts
import mitt from 'mitt'
import type {Emitter} from 'mitt'

// 定义所有事件的类型（事件名：参数类型）
type Events = {
  isHide: boolean; // 明确 'isHide' 事件的参数是 boolean 类型
  isShowBtns:boolean,
  isFinish:boolean,  // 录制视频结束 拍照结束
  isDoingRecord:boolean // 正在录制视频中
}

// 创建带类型的事件总线实例
const bus: Emitter<Events> = mitt<Events>()

export default bus