import Axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'
import type { IZoveHttp, zoveHttpError, RequestMethods, ZoveHttpResponse, ZoveHttpRequestConfig } from './types'

const whiteList: string[] = []

const defaultConfig: InternalAxiosRequestConfig<any> = {
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 5000,
  headers: {} as any,
}

class ZoveHttp implements IZoveHttp {
  config: InternalAxiosRequestConfig
  constructor(config?: InternalAxiosRequestConfig) {
    this.config = Object.assign(defaultConfig, config ?? {})
    ZoveHttp.axiosInstance = Axios.create(this.config)
    this.httpInterceptorsRequest()
    this.httpInterceptorsResponse()
  }

  /** 保存当前Axios实例对象 */
  private static axiosInstance: AxiosInstance

  /** 请求拦截 */
  private httpInterceptorsRequest(): void {
    ZoveHttp.axiosInstance.interceptors.request.use(
      (config: ZoveHttpRequestConfig) => {
        if (typeof config.beforeRequestCallback === 'function') {
          config.beforeRequestCallback(config)
          return config
        }
        /** 请求白名单，放置一些不需要token的接口*/
        return whiteList.some((v) => config.url && config.url.indexOf(v) > -1)
          ? config
          : new Promise((resolve) => {
              //   const token = sessionData('get', 'token')
              //   const loginlevel = sessionData('get', 'userLevel')
              //   if (token) {
              //       config.headers['H-Zove-Token'] = token
              //   }
              //   if (loginlevel) {
              //       config.headers['H-Zove-UserLevel'] = loginlevel
              //   }
              resolve(config)
            })
      },
      (error) => {
        return Promise.reject(error)
      },
    )
  }

  /** 响应拦截 */
  private httpInterceptorsResponse(): void {
    const instance = ZoveHttp.axiosInstance
    instance.interceptors.response.use(
      (response: ZoveHttpResponse) => {
        const $config = response.config
        if (typeof $config.beforeResponseCallback === 'function') {
          $config.beforeResponseCallback(response)
          return response.data
        }
        return response.data
      },
      (error: zoveHttpError) => {
        const $error = error
        // // 所有的响应异常 区分来源为取消请求/非取消请求
        // $error.isCancelRequest = Axios.isCancel($error)
        // !$error.isCancelRequest && statusMessage($error.status, ($error as any)?.response?.data?.message || $error.message)
        return Promise.reject($error)
      },
    )
  }

  /** 通用请求工具函数 */
  public request<T>(
    method: RequestMethods,
    url: string,
    param?: Pick<AxiosRequestConfig<any>, 'data'>,
    axiosConfig?: ZoveHttpRequestConfig,
  ): Promise<T> {
    const config = {
      method,
      url,
      data: param,
      ...axiosConfig,
    } as ZoveHttpRequestConfig

    // 单独处理自定义请求/响应回掉
    return new Promise((resolve, reject) => {
      ZoveHttp.axiosInstance
        .request(config)
        .then((response: any) => {
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}

export const http = new ZoveHttp()
export default ZoveHttp
