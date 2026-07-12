/**
 * API 客户端代理模块
 * 通过 Proxy 拦截 API 调用，将其转换为发送给 background script 的消息，
 * 实现 content script 与 background 之间的 API 通信。
 */
import type { API_COLLECTION } from '~/background/messageListeners/api'

/** 将 snake_case 字符串转为 camelCase 的类型工具 */
type CamelCase<S extends string> = S extends `${infer P1}_${infer P2}${infer P3}`
  ? `${Lowercase<P1>}${Uppercase<P2>}${CamelCase<P3>}`
  : Lowercase<S>

/** 根据 API_COLLECTION 定义，生成对应的 API 函数类型签名 */
type APIFunction<T = typeof API_COLLECTION> = {
  [K in keyof T as CamelCase<string & K>]: {
    // @ts-expect-error allow params
    [P in keyof T[K]]: T[K][P] extends (...args: any[]) => any ? T[K][P] : Lowercase<T[K][P]['_fetch']['method']> extends 'get' ? (options?: Partial<T[K][P]['params']>) => Promise<any> : (options?: Partial<T[K][P]['params'] & T[K][P]['_fetch']['body']>) => Promise<any>
  }
}

// eslint-disable-next-line ts/no-unsafe-declaration-merging
export interface APIClient extends APIFunction<typeof API_COLLECTION> {

}

/**
 * API 客户端类
 * 使用双层 Proxy 实现 API 调用：
 * - 第一层 Proxy 按命名空间缓存 API 对象
 * - 第二层 Proxy 将属性访问转换为 browser.runtime.sendMessage 调用
 */
// eslint-disable-next-line ts/no-unsafe-declaration-merging
export class APIClient {
  /** 缓存已创建的命名空间 API Proxy，避免重复创建 */
  private readonly cache = new Map<string | symbol, any>()

  constructor() {
    // @ts-expect-error ignore
    return new Proxy({}, {
      get: (_, namespace) => { // namespace
        if (this.cache.has(namespace)) {
          return this.cache.get(namespace)
        }
        else {
          const api = new Proxy({}, {
            get(_, p) {
              return (options?: object) => {
                return browser.runtime.sendMessage({
                  contentScriptQuery: p,
                  ...options,
                })
              }
            },
          })
          this.cache.set(namespace, api)
          return api
        }
      },
    })
  }
}

const api = new APIClient()

export default api
