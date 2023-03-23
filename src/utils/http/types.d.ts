import { Method, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

export type RequestMethods = Extract<Method, 'get' | 'post' | 'put' | 'delete' | 'patch' | 'option' | 'head'>

export interface zoveHttpError extends AxiosError {
  isCancelRequest?: boolean
}

export interface ZoveHttpResponse extends AxiosResponse {
  config: ZoveHttpRequestConfig
}

export interface ZoveHttpRequestConfig extends InternalAxiosRequestConfig {
  beforeRequestCallback?: (request: ZoveHttpRequestConfig) => void
  beforeResponseCallback?: (response: ZoveHttpResponse) => void
}

export interface IZoveHttp {
  config: InternalAxiosRequestConfig
  request<T>(
    method: RequestMethods,
    url: string,
    param?: InternalAxiosRequestConfig,
    axiosConfig?: ZoveHttpRequestConfig,
  ): Promise<T>
}
