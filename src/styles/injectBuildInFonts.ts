/**
 * 注入内置字体
 * 通过 CSS @font-face 动态注入扩展内置的字体资源，
 * 包括数字字体、西文字体、中文字体和中文破折号专用字体
 */
import browser from 'webextension-polyfill'

import { injectCSS } from '~/utils/main'

/** 注入内置字体的 @font-face 声明到页面 */
injectCSS(`
  @font-face {
    font-family: "Numbers";
    unicode-range: U+0030-0039;
    src: url(${browser.runtime.getURL('/assets/fonts/Geist[wght].woff2')}) format("woff2-variations");
  }

  @font-face {
    font-family: "Onest";
    src: url(${browser.runtime.getURL('/assets/fonts/Onest[wght].woff2')}) format("woff2-variations");
  }

  @font-face {
    font-family: "ShangguSansSCVF";
    src: url(${browser.runtime.getURL('/assets/fonts/ShangguSansSC-VF.ttf')}) format("truetype-variations");
  }

  @font-face {
    font-family: "CJKEmDash";
    unicode-range: U+2014, U+2E3A-2E3B;
    src: url(${browser.runtime.getURL('/assets/fonts/ZhudouSansVF-subset.woff2')}) format("woff2-variations");
  }
`)
