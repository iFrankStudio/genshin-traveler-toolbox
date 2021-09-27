export enum Server {
  SkyIsland = 1, // 天空岛，国服
  WorldTree = 5, // 世界树，渠道服
  THM = 9, // TW，HK，MO， 港澳台
  Asia = 8, // 亚洲服务器
  Europe = 7, // 欧洲服务器
  America = 6 // 美国服务器
}

export enum GenshinWishType {
  PermanentWish = '200', // 常驻祈愿
  NoviceWish = '100', // 新手祈愿
  CharacterEventWish = '301', // 角色活动祈愿
  WeaponEventWish = '302' // 武器活动祈愿
}

export const wishes = [
  GenshinWishType.CharacterEventWish,
  GenshinWishType.WeaponEventWish,
  GenshinWishType.PermanentWish,
  GenshinWishType.NoviceWish
]

export type WishesCollection = Map<GenshinWishType, GachaRecord[]>

export interface GetGachaLogPageUrlParams {
  authkey_ver: number
  sign_type: number
  auth_appid: string
  init_type: GenshinWishType
  gacha_id: string
  timestamp: string
  lang: string
  device_type: string
  ext: string | JSON
  game_version: string
  region: string
  authkey: string
  game_biz: string
}

export interface PageParams {
  page: number
  size: number
  end_id: string
}

export interface GetGachaLogApiParams
  extends GetGachaLogPageUrlParams,
    PageParams {
  gacha_type: GenshinWishType
}

export interface GachaRecord {
  uid: string // "101234567",
  gacha_type: GenshinWishType // "301",
  item_id: string // "",
  count: string // "1",
  time: string // "2021-06-01 07:00:00",
  name: string // "鸦羽弓",
  lang: string // "zh-cn",
  item_type: string // "武器" | "角色",
  rank_type: '5' | '4' | '3' // "3",
  id: string // "1012345670000001234"
}

export interface PaginatedData<T> {
  page: string
  size: string
  total: string // 接口可能只会返回"0"
  list: T[]
}

export interface GetGachaLogApiResponse {
  retcode: number
  message: string
  data: PaginatedData<GachaRecord> | null
  region?: string // "cn_gf01"
}
