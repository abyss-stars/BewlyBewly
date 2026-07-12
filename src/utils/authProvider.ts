/**
 * Bilibili TV 端认证提供者
 * 通过 TV 端二维码登录方式进行身份认证，包含获取二维码和轮询登录状态的功能。
 */
// import browser from 'webextension-polyfill'
import { accessKey } from '~/logic/storage'

import { appSign } from './appSign'

/** 清除已存储的 accessKey */
export function revokeAccessKey() {
  accessKey.value = null
}

/**
 * Bilibili TV 端应用的 AppKey 和 AppSecret
 * @see https://socialsisteryi.github.io/bilibili-API-collect/docs/misc/sign/APPKey.html#appkey
 */
export const TVAppKey = {
  appkey: '4409e2ce8ffd12b8',
  appsec: '59b43e04ad6965f34319062b478f83dd',
}

/**
 * 使用 TV 端密钥签名参数并返回 URLSearchParams
 * @see https://github.com/magicdawn/bilibili-app-recommend/blob/e91722cc076fe65b98116fb0248236851ae6e1dc/src/utility/access-key/tv-qrcode/api.ts#L8
 */
export function tvSignSearchParams(params: Record<string, any>) {
  const sign = appSign(params, TVAppKey.appkey, TVAppKey.appsec)
  return new URLSearchParams({
    ...params,
    sign,
  })
}

/** 获取参数的 TV 端签名字符串 */
export function getTvSign(params: Record<string, any>) {
  return appSign(params, TVAppKey.appkey, TVAppKey.appsec)
}

/**
 * 轮询 TV 端登录二维码的扫描状态
 * @param authCode - 二维码对应的授权码
 * @returns Promise，resolve 时返回登录结果
 */
export function pollTVLoginQRCode(authCode: string): Promise<any> {
  const url = 'https://passport.bilibili.com/x/passport-tv-login/qrcode/poll'

  return new Promise<void>((resolve, reject) => {
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: tvSignSearchParams({
        appkey: TVAppKey.appkey,
        auth_code: authCode,
        local_id: '0',
        ts: '0',
      }),
    })
      .then(response => response.json())
      .then(data => resolve(data))
      .catch(error => reject(error))
  })
}

/**
 * 获取 TV 端登录二维码的 auth_code
 * @returns Promise，resolve 时返回包含 auth_code 的响应数据
 */
export function getTVLoginQRCode(): Promise<any> {
  const url = 'https://passport.bilibili.com/x/passport-tv-login/qrcode/auth_code'

  return new Promise<void>((resolve, reject) => {
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: tvSignSearchParams({
        appkey: TVAppKey.appkey,
        local_id: '0',
        ts: '0',
      }),
    })
      .then(response => response.json())
      .then(data => resolve(data))
      .catch(error => reject(error))
  })
}
