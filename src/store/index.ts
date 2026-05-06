import { NewBusStore } from "./NewBusStore";
import { CommonStore } from "./CommonStore";
import { createContext, useContext } from "react";
import { AsyncTrunk } from 'mobx-sync';
import AsyncStorage from '@react-native-async-storage/async-storage';


export class RootStore {
  newbus: NewBusStore;
  common: CommonStore;

  constructor() {
    this.newbus = new NewBusStore();
    this.common = new CommonStore();
  }

}

export const rootStore = new RootStore();

export const trunk = new AsyncTrunk(rootStore, {
  storage: AsyncStorage,
})

export const StoreContext = createContext(rootStore);
export const StoreProvider = StoreContext.Provider;
export const useStore = () => useContext(StoreContext);