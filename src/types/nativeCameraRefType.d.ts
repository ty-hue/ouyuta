import {FlashValueType} from './enums'
// 照相第一个参数的类型
interface captureImageFirstParamType {
    savePath: string;
    format: string;
    quality: number;
    timeInterval: number;
  }
  // 开始录像函数第一个参数的类型
  interface startVideoCaptureFirstParamType {
    savePath: string;
    isAddAudio: boolean;
    videoEncoder: number;
    audioEncoder: number;
    timeInterval: number;
  }
  interface switchCameraParamsType {
    cameraId?: number;
  }
  interface androidSetCameraParamsType {
    picSizeWidth: any;
    picSizeHeight: any;
    jpegQuality: number;
    preSizeWidth: any;
    preSizeHeight: any;
    videoSizeWidth: any;
    videoSizeHeight: any;
    videoEncodingBitRate: number;
  }
  interface setFPSParamType {
    fps?: number;
  }
 export interface CameraInsType {
    initCamera: () => void;
    stopVideoCapture: () => void;
    captureImage: (
      dic: captureImageFirstParamType,
      successCallback: (res: any) => void,
      failCallback: (err: any) => void
    ) => void;
    startVideoCapture: (
      dic: startVideoCaptureFirstParamType,
      callback: (res: any) => void
    ) => void;
    android_getCameras: (callback: (res: any) => void) => void;
    switchCamera: (prama: switchCameraParamsType) => void;
    getZoomFactor: (callback: (res: any) => void) => void;
    getMaxZoomFactor: (callback: (res: any) => void) => void;
    getMinZoomFactor: (callback: (res: any) => void) => void;
    setZoomFactor: (callback: (res: any) => void) => void;
    setFlash: (param: FlashValueType) => void;
    setTorch: (param: string) => void;
    ios_getSessionPresets: (callback: (res: any) => void) => void;
    ios_setSessionPreset: (param: string) => void;
    android_getSupportedPictureSizes: (callback: (res: any) => void) => void;
    android_getSupportedPreviewSizes: (callback: (res: any) => void) => void;
    android_getSupportedVideoSizes: (callback: (res: any) => void) => void;
    setRotation: (param: null) => void;
    android_setCameraParams: (parma: androidSetCameraParamsType) => void;
    setFPS: (param: setFPSParamType) => void;
    setAutoFPS: () => void;
  }