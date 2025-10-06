import { TOKEN } from "@/const/sysConst";
import type{ResponseData} from '@/types/requestTypes'
interface getAudioFromVideoReturnType {
  audioUrl:string,
}

// 提取上传的视频的音频，形成一个音频文件，返回值为音频文件的路径
export const getAudioFromVideo = async ( filePath:string ) => {
  const token =uni.getStorageSync(TOKEN);   
  return await new Promise<getAudioFromVideoReturnType>((resolve,reject)=>{
    uni.uploadFile({
      url: `${import.meta.env.VITE_BASE_URL}/api/upload/getAudioFromVideo`, // 换成你的后端上传接口
      filePath,
      name: 'video', // 后端接收视频的字段名
      header: {
        'authorization': token,
      },
      formData: {
      },
      success: (uploadRes :any) => {
        const upRes = JSON.parse(uploadRes.data)
        
        if((upRes as unknown as ResponseData).code === 0){          
          resolve((upRes as unknown as ResponseData).data as getAudioFromVideoReturnType)
          return
        }
        reject((upRes as unknown as ResponseData).msg)
        uni.showToast({ title: (upRes as unknown as ResponseData).msg, icon: 'none' })
      },
      fail: (err) => {
        uni.showToast({ title: '提取视频音频失败', icon: 'none' })
        reject(err.errMsg)
      }
    })
  })
};


