/**
 * 认证相关 API 定义
 * 包含登出、获取登录二维码、扫码登录等接口
 * 使用 AHS.J_S 后处理流（JSON 解析后 sendResponse），因为登录流程需要手动处理响应
 */
import type { APIMAP } from '../../utils'
import { AHS } from '../../utils'

const API_AUTH = {
  /** 退出登录 */
  logout: {
    url: 'https://passport.bilibili.com/login/exit/v2',
    _fetch: {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: {
        biliCSRF: '',
        // biliJct: '',
      },
    },
    params: {
      biliCSRF: '',
    },
    afterHandle: AHS.J_S,
  },
  /** 获取 TV 端登录二维码 */
  getLoginQRCode: {
    url: 'https://passport.bilibili.com/x/passport-tv-login/qrcode/auth_code',
    _fetch: {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
    },
    params: {
      appkey: '4409e2ce8ffd12b8',
      local_id: '0',
      ts: '0',
      sign: 'e134154ed6add881d28fbdf68653cd9c',
    },
    afterHandle: AHS.J_S,
  },
  /** 使用 auth_code 完成扫码登录 */
  qrCodeLogin: {
    url: 'https://passport.bilibili.com/x/passport-tv-login/qrcode/auth_code',
    _fetch: {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
    },
    params: {
      appkey: '4409e2ce8ffd12b8',
      auth_code: '',
      local_id: '0',
      ts: '0',
      sign: 'e134154ed6add881d28fbdf68653cd9c',
    },
    afterHandle: AHS.J_S,
  },
} satisfies APIMAP

export default API_AUTH
