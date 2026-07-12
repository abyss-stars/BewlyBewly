/**
 * Bilibili API 签名工具
 * 为请求参数进行 APP 签名，确保 API 请求的合法性
 * @see https://socialsisteryi.github.io/bilibili-API-collect/docs/misc/sign/APP.html#typescript-javascript
 */
import md5 from 'md5'

/** 请求参数类型 */
type Params = Record<string, any>

/**
 * 对请求参数进行 APP 签名
 * @param params - 请求参数对象
 * @param appkey - Bilibili 应用密钥
 * @param appsec - Bilibili 应用密钥的保密字符串
 * @returns 32位 MD5 签名字符串
 */
export function appSign(params: Params, appkey: string, appsec: string): string {
  params.appkey = appkey
  const searchParams = new URLSearchParams(params)
  searchParams.sort()
  return md5(searchParams.toString() + appsec)
}
