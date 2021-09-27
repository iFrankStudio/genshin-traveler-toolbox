import { PathLike, promises as fs } from 'fs-extra'
import path from 'path'
import got from 'got'
import { app } from 'electron'
import regedit from 'regedit'
import ini from 'ini'
import debugLogger from 'electron-log'
import packageRoot from '../../package.json'

export const isDev = !app.isPackaged
export const isDebug = process.env.BUILD_TARGET === 'debug'
export const appId = packageRoot.build.appId

export const appRoot = isDev
  ? path.resolve(__dirname, '..')
  : path.resolve(app.getAppPath(), '../..')
export const userDataPath = path.resolve(appRoot, 'userData')

const vbsDirectory = path.join(appRoot, './resources/regedit/vbs')
const folder = isDev
  ? path.join(appRoot, './node_modules/regedit/vbs')
  : vbsDirectory
const msg = regedit.setExternalVBSLocation(folder)
debugLogger.info('regedit.setExternalVBSLocation:', msg)
export const useRegedit = regedit

export function getUserPath() {
  if (!process.env.WINEPREFIX) {
    return app.getPath('home')
  } else {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return path.join(process.env.WINEPREFIX, 'drive_c/users', process.env.USER!)
  }
}

export function authkeyMask(text = '') {
  return text.replace(/authkey=[^&]+&/g, 'authkey=***&')
}

export async function request<T = unknown>(url: string, timeout = 15 * 1000) {
  const res = await got<T>(url, {
    timeout,
    responseType: 'json'
  })
  return res.body
}

export const langMap = new Map([
  ['zh-cn', '简体中文'],
  ['zh-tw', '繁體中文'],
  ['de-de', 'Deutsch'],
  ['en-us', 'English'],
  ['es-es', 'Español'],
  ['fr-fr', 'Français'],
  ['id-id', 'Indonesia'],
  ['ja-jp', '日本語'],
  ['ko-kr', '한국어'],
  ['pt-pt', 'Português'],
  ['ru-ru', 'Pусский'],
  ['th-th', 'ภาษาไทย'],
  ['vi-vn', 'Tiếng Việt']
])

export const localeMap = new Map([
  ['zh-cn', ['zh', 'zh-CN']],
  ['zh-tw', ['zh-TW']],
  ['de-de', ['de-AT', 'de-CH', 'de-DE', 'de']],
  ['en-us', ['en-AU', 'en-CA', 'en-GB', 'en-NZ', 'en-US', 'en-ZA', 'en']],
  ['es-es', ['es', 'es-419']],
  ['fr-fr', ['fr-CA', 'fr-CH', 'fr-FR', 'fr']],
  ['id-id', ['id']],
  ['ja-jp', ['ja']],
  ['ko-kr', ['ko']],
  ['pt-pt', ['pt-BR', 'pt-PT', 'pt']],
  ['ru-ru', ['ru']],
  ['th-th', ['th']],
  ['vi-vn', ['vi']]
])

export function detectLocale() {
  const locale = app.getLocale()
  let result = 'zh-cn'
  for (const [key, list] of localeMap) {
    if (list.includes(locale)) {
      result = key
      break
    }
  }
  return result
}

export async function existsDirOrFile(_path: PathLike) {
  try {
    await fs.access(_path)
  } catch (error) {
    return false
  }
  return true
}

export async function readConfigFile<T>(filePath: PathLike) {
  const file = await fs.readFile(filePath, 'utf-8')
  return ini.parse(file) as T
}
