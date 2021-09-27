/* eslint-disable no-unused-vars */
import { InjectionKey } from 'vue'
import {
  createStore,
  useStore as baseUseStore,
  Store,
  StoreOptions
} from 'vuex'
import gacha, { GachaState } from './modules/gacha'

export interface RootState {
  gacha: GachaState
}

export const key: InjectionKey<Store<RootState>> = Symbol()

const store: StoreOptions<RootState> = {
  modules: {
    gacha
  }
}

export const useStore = () => baseUseStore(key)

export default createStore(store)
