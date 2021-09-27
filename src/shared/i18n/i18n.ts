import { findKey } from 'lodash-es'

export class I18nHelper {
  static async getIdByName(entity: string, name: string) {
    const lang = 'zh-cn'
    let data: Record<string, string>
    switch (entity) {
      case '武器':
      case 'weapon':
        data = (await import(`./weapons/${lang}.json`)).default
        break
      case '角色':
      case 'charactor':
        data = (await import(`./characters/${lang}.json`)).default
        break
      default:
        data = {}
    }
    return findKey(data, _name => _name === name)
  }
}
