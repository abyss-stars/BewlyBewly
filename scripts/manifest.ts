import fs from 'fs-extra'

import { getManifest } from '../src/manifest'
import { isFirefox, isSafari, log, r } from './utils'

/**
 * 写入 manifest.json 到对应的扩展目录
 * 根据目标浏览器（Chrome/Firefox/Safari）输出到不同目录
 */
export async function writeManifest() {
  await fs.writeJSON(r(
    isFirefox
      ? 'extension-firefox/manifest.json'
      : isSafari ? 'extension-safari/manifest.json' : 'extension/manifest.json',
  ), await getManifest(), { spaces: 2 })
  log('PRE', 'write manifest.json')
}

writeManifest()
