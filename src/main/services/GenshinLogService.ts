import fs from 'fs-extra'
import path from 'path'
import { Service } from './Service'
import { getUserPath } from '../utils'
import { GachaLogApi } from '../lib/GenshinApiSDK'
import { GenshinWishType, GachaRecord } from '../../shared/GenshinApiTypes'

export class GenshinLogService extends Service {
  async detectLogFileLocale(international = false): Promise<string> {
    let relativePaths = ''
    if (!international) {
      relativePaths = path.join(
        '/AppData/LocalLow/miHoYo/',
        '原神/output_log.txt'
      )
    } else {
      relativePaths = path.join(
        '/AppData/LocalLow/miHoYo/',
        'Genshin Impact/output_log.txt'
      )
    }

    const fullPath = path.join(getUserPath(), relativePaths)
    try {
      await fs.access(fullPath, fs.constants.F_OK)
      return fullPath
    } catch (e) {
      this.error('text.file.notFound', fullPath, e)
      throw new Error('text.file.notFound')
    }
  }

  async getGachaLogPageUrlFromLogFile(filePath: string): Promise<string> {
    const logText = await fs.readFile(filePath, 'utf8')
    const arr = logText.match(
      /^OnGetWebViewPageFinish:https:\/\/.+\?.+?(?:#.+)?$/gm
    )
    if (arr && arr.length) {
      // 返回日志文件中最后一个祈愿记录页面地址
      return arr[arr.length - 1].replace('OnGetWebViewPageFinish:', '')
    }
    this.error('text.url.notFound')
    throw new Error('text.url.notFound')
  }

  async fetchLog(
    wishType: GenshinWishType,
    gachaLogPageUrl: string,
    retryCount = 5
  ): Promise<GachaRecord[]> {
    const api = new GachaLogApi(gachaLogPageUrl).setPageParams({ size: 10 })
    try {
      if (retryCount-- > 0) {
        const res = await api.setWishType(wishType).getLogs(true)
        // this.log('fetchLog', wishType, res)
        // this.logs.set(wishType, res)
        return res
      } else {
        throw new Error('End of retry')
      }
    } catch (e) {
      this.error(e)
      if (retryCount > 0)
        return this.fetchLog(wishType, gachaLogPageUrl, retryCount)
      else throw e
    }
  }
}
