import { Module } from 'vuex'
import { RootState } from '..'
import { GenshinWishType, WishesCollection } from '/@shared/GenshinApiTypes'

export interface GachaState {
  logPageUrl: string
  wishes: WishesCollection
}

const mod: Module<GachaState, RootState> = {
  namespaced: true,
  state: {
    logPageUrl: '',
    wishes: new Map()
  },
  getters: {
    getWishesByType(state, type: GenshinWishType) {
      return state.wishes.get(type)
    }
  },
  mutations: {
    setLogPageUrl(state, url: string) {
      state.logPageUrl = url
    },
    updateWishes(state, wishes: WishesCollection) {
      state.wishes = wishes
    }
  }
}

export default mod
