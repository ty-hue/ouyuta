/**
 * 封装uni.request，实现请求/响应拦截
 */
import type { RequestConfig, ResponseData } from "./../types/requestTypes";
import { TOKEN } from "./../const/sysConst";
export class Request {
  // 基础配置
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl = "", timeout = 10000) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  /**
   * 请求拦截器：请求发起前的处理
   * @param config 请求配置
   * @returns 处理后的配置
   */
  private requestInterceptor(config: RequestConfig) {
    // 1. 添加基础URL
    if (config.url && !config.url.startsWith("http")) {
      config.url = this.baseUrl + config.url;
    }

    // 2. 添加Token（示例：从本地存储获取）
    const token = uni.getStorageSync("token");
    if (token) {
      config.header = {
        ...config.header,
        authorization: `${token}`, // 根据后端要求调整格式
      };
    }

    // 3. 显示加载中（可根据需求关闭，如某些请求不需要加载提示）
    if (config.showLoading) {
      uni.showLoading({
        title: "加载中...",
        mask: true,
      });
    }

    // 4. 设置超时时间
    config.timeout = this.timeout;

    return config;
  }

  /**
   * 响应拦截器：请求返回后的处理
   * @param response 响应结果
   * @param showLoading 是否需要隐藏加载中
   * @returns 处理后的响应数据
   */
  private responseInterceptor(
    response:
      | UniApp.RequestSuccessCallbackResult
      | UniApp.GeneralCallbackResult,
    showLoading: boolean
  ) {
    // 1. 隐藏加载中
    if (showLoading) {
      uni.hideLoading();
    }

    // 2. 处理网络错误（如超时、断网）
    if (!("statusCode" in response)) {
      uni.showToast({
        title: `请求失败：${response.errMsg}`,
        icon: "none",
        duration: 3000,
      });
      return Promise.reject(response);
    }
    // 3. 处理业务错误（根据后端状态码自定义）
    const res = response as UniApp.RequestSuccessCallbackResult;
    const data = res.data as ResponseData;

    // 示例：假设后端约定 code=0 为成功，其他为错误
    if (data.code !== 0) {
      // 特殊错误处理：如Token过期
      if (data.code === 401) {
        uni.removeStorageSync(TOKEN); // 清除无效token
        uni.navigateTo({ url: "/pages/login/index" }); // 跳转到登录页
      }

      // 通用错误提示
      uni.showToast({
        title: data.msg || "操作失败",
        icon: "none",
        duration: 3000,
      });
      return Promise.reject(data);
    }

    // 4. 只返回业务数据（过滤掉HTTP层信息）
    return Promise.resolve(data.data);
  }

  /**
   * 核心请求方法
   * @param config 请求配置
   * @returns 响应数据
   */
  request<T = any>(config: RequestConfig): Promise<T> {
    // 执行请求拦截
    const processedConfig = this.requestInterceptor({ ...config });
    const { showLoading = true } = processedConfig;
    return new Promise((resolve, reject) => {
      uni.request({
        ...processedConfig,
        success: (response) => {
          // 执行响应拦截（成功）
          this.responseInterceptor(response, showLoading)
            .then((response: T) => resolve(response))
            .catch((err: ResponseData) => reject(err));
        },
        fail: (error) => {
          console.log("失败", error);
          // 执行响应拦截（失败） 这里不可能返回成功的promise，所以只需要对失败的promise进行处理
          this.responseInterceptor(error, showLoading).catch(
            (err: UniApp.GeneralCallbackResult) => {
              reject(err);
            }
          );
        },
      });
    });
  }

  // 快捷方法：GET请求
  get<T = any>(
    url: string,
    data?: any,
    config?: Omit<RequestConfig, "url" | "data" | "method">
  ) {
    return this.request<T>({ ...config, url, data, method: "GET" });
  }

  // 快捷方法：POST请求
  post<T = any>(
    url: string,
    data?: any,
    config?: Omit<RequestConfig, "url" | "data" | "method">
  ) {
    return this.request<T>({ ...config, url, data, method: "POST" });
  }
  // 快捷方法：PUT请求
  put<T = any>(
    url: string,
    data?: any,
    config?: Omit<RequestConfig, "url" | "data" | "method">
  ) {
    return this.request<T>({ ...config, url, data, method: "PUT" });
  }
  // 快捷方法：DELETE请求
  delete<T = any>(
    url: string,
    data?: any,
    config?: Omit<RequestConfig, "url" | "data" | "method">
  ) {
    return this.request<T>({ ...config, url, data, method: "DELETE" });
  }
}

// 创建请求实例（可根据环境切换baseUrl）
export const request = new Request(
  // 示例：开发环境和生产环境的不同baseUrl
  import.meta.env.VITE_BASE_URL
);

/**
 * 总结：
 * 一：内部封装总结：
 * 1.request方法返回失败状态promise的情况分两种：1，网络错误 2.网络无问题，但code===1，业务逻辑错误
 * 2.request方法返回成功状态promise的情况只有一种：网络无问题且业务逻辑正常
 * 3.request的泛型T，只作用于成功状态的promise返回的数据，因为如果是失败的promise返回的数据的类型，我们已经在request方法内部进行了明确指定。
 * 二：外部调用request方法注意事项：
 * 1.一定要try catch，因为requset方法可能会返回一个失败状态的promise，如果不处理就会报错，导致程序崩溃
 * 2. 我们调用request方法的时候，如果不知道泛型，那么成功状态的promise的数据就是any，但是通常情况下，因为后端返回的数据里面的data的值，是多变的，所以我们通常不明确它的具体ts类型，所以我们在调用的时候往往不需要传递这个泛型，除非你知道它的明确类型。
 */
