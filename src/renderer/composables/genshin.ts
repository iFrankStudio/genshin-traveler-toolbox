import { computed, reactive } from 'vue'
import { groupBy, sortBy, takeRightWhile, reverse } from 'lodash-es'
import { GenshinClient } from '/@shared/GenshinClientTypes'
import { GachaRecord, wishes, WishesCollection } from '/@shared/GenshinApiTypes'
import { useService } from './service'
import { useStore } from '../store'
import { ListItem } from '/@/components/GachaListCard'
import { I18nHelper } from '/@shared/i18n/i18n'

/**
 * 获取启动器版本最新的客户端
 * @param clients Array<GenshinClient> 需要对比的客户端数组
 * @returns Array<GenshinClient> 启动器版本号最高的客户端
 */
export function getClientsWithLatestLauncher(
  clients: GenshinClient[]
): GenshinClient[] {
  const sorted = sortBy(clients, client => {
    return client.launcher.version
  })
  return takeRightWhile(sorted, item => {
    return item.launcher.version === sorted[sorted.length - 1].launcher.version
  })
}

export function useGacha() {
  const store = useStore()
  const logPageUrl = computed(() => store.state.gacha.logPageUrl)
  const setLogPageUrl = (url: string) =>
    store.commit('gacha/setLogPageUrl', url)

  const { fetchLog } = useService<'GenshinLogService'>('GenshinLogService')
  const updateWishes = async () => {
    const _wishes: WishesCollection = new Map()
    const promises = wishes.map(async wish => {
      _wishes.set(wish, await fetchLog(wish, logPageUrl.value))
    })
    await Promise.all(promises)
    store.commit('gacha/updateWishes', _wishes)
  }

  const allWishes = computed(() => store.state.gacha.wishes)

  return {
    logPageUrl,
    setLogPageUrl,
    updateWishes,
    wishes: allWishes
  }
}

export class GachaLogsAnalyser {
  static OverviewOfAll(data: WishesCollection) {
    let arr: GachaRecord[] = []
    data.forEach(records => (arr = arr.concat(records)))
    return this.OverviewOfRecords(arr)
  }

  static OverviewOfRecords(records: GachaRecord[]) {
    const groupedByType = groupBy(records, record => record.item_type)
    const roles = groupBy(groupedByType['角色'], record => record.rank_type)
    const weapons = groupBy(groupedByType['武器'], record => record.rank_type)

    function findLatestIndexOfRankType(rankType: '5' | '4' | '3') {
      return records.findIndex(r => r.rank_type === rankType)
    }

    const lastRank5 = findLatestIndexOfRankType('5'),
      lastRank4 = findLatestIndexOfRankType('4')

    return {
      roles,
      weapons,
      count: {
        total: records.length,
        lastRank5,
        lastRank4,
        avgRank5: (function () {
          const _count = (roles['5']?.length || 0) + (weapons['5']?.length || 0)
          return _count > 0
            ? Math.round((records.length - lastRank5 - 1) / _count)
            : NaN
        })(),
        avgRank4: (function () {
          const _count = (roles['4']?.length || 0) + (weapons['4']?.length || 0)
          return _count > 0
            ? Math.round((records.length - lastRank4 - 1) / _count)
            : NaN
        })(),
        roles: {
          total: groupedByType['角色']?.length || 0,
          rank5: roles['5']?.length || 0,
          rank4: roles['4']?.length || 0
        },
        weapons: {
          total: groupedByType['武器']?.length || 0,
          rank5: weapons['5']?.length || 0,
          rank4: weapons['4']?.length || 0,
          rank3: weapons['3']?.length || 0
        }
      }
    }
  }

  static async ConvertToList(records: GachaRecord[]) {
    const gachaListConverted: Record<'5' | '4' | '3', ListItem[]> = reactive({
      '5': [],
      '4': [],
      '3': []
    })

    const lastRankCount = {
      '5': 1,
      '4': 1,
      '3': 1
    }

    for (let i = records.length; i > 0; i--) {
      const record = records[i - 1]
      const id = await I18nHelper.getIdByName(record.item_type, record.name)

      if (id) {
        gachaListConverted[record.rank_type].push({
          id,
          name: record.name,
          type: record.item_type === '武器' ? 'weapon' : 'character',
          rate: record.rank_type,
          note: lastRankCount[record.rank_type]
        })
      } else {
        console.error(`找不到与 "${record.name}" 对应的 id`)
      }

      if (record.rank_type === '3') {
        lastRankCount['5']++
        lastRankCount['4']++
      } else if (record.rank_type === '4') {
        lastRankCount['5']++
        lastRankCount['4'] = 1
      } else {
        lastRankCount['5'] = 1
        lastRankCount['4']++
      }
    }

    reverse(gachaListConverted['5'])
    reverse(gachaListConverted['4'])
    return gachaListConverted
  }
}
