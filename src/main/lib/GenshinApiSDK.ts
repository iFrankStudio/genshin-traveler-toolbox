import Url from 'url-parse'
import { request } from '../utils'
import {
  GachaRecord,
  GenshinWishType,
  GetGachaLogApiResponse,
  PageParams
} from '/@shared/GenshinApiTypes'
import { sleep } from '/@shared/utils'

class BaseGenshinApi {
  readonly apiDomain = 'hk4e-api.mihoyo.com'

  url: Url

  constructor(gachaLogPageUrl: string) {
    this.url = new Url(gachaLogPageUrl, true)
    // this.setWishType()
  }

  setWishType(type: GenshinWishType = GenshinWishType.CharacterEventWish) {
    // const reg = /(?<=gacha_type=)([0-9]*)/i
    // this.url.query['gacha_type'] = type
    this.url.set('query', {
      ...this.url.query,
      gacha_type: type
    })
    return this
  }
}

export class GachaLogApi extends BaseGenshinApi {
  private pageParams: PageParams = {
    page: 1,
    size: 6,
    end_id: '0'
  }

  private data: GachaRecord[] = []

  setPageParams(params: Partial<PageParams>) {
    Object.assign(this.pageParams, params)
    return this
  }

  generateApi(pageParams = this.pageParams) {
    this.url.set('host', this.apiDomain)
    this.url.set('pathname', '/event/gacha_info/api/getGachaLog')
    this.url.set('query', {
      ...this.url.query,
      page: pageParams.page.toString(),
      size: pageParams.size.toString(),
      end_id: pageParams.end_id
    })

    // console.log(this.url.toString())

    return this.url.toString()
  }

  async getLogsOfPage(pageParams = this.pageParams): Promise<number> {
    const res = await request<GetGachaLogApiResponse>(
      this.generateApi(pageParams)
    )

    if (res.retcode !== 0) {
      throw new Error('Get Log Faild: ' + res.message)
    }
    if (res.data && res.data.list.length > 0) {
      this.data.push(...res.data.list)
      const endId = res.data.list[res.data.list.length - 1].id
      this.setNextPage(endId)
      return res.data.list.length
    }
    return 0
  }

  async getLogs(refresh = false) {
    if (!refresh && this.data.length !== 0) return this.data

    let logsNum = 0
    this.resetPage()
    do {
      logsNum = await this.getLogsOfPage()
      await sleep(1)
    } while (logsNum === this.pageParams.size)
    return this.data
  }

  private resetPage() {
    this.pageParams = {
      page: 1,
      size: 6,
      end_id: '0'
    }
    return this
  }

  private setNextPage(endId: string) {
    this.pageParams.end_id = endId
    this.pageParams.page++
    return this
  }
}
