import { defaultComponentStore, type ComponentStore } from "../craftComponents/types";

export type ItemStore = {
  craftComponents: ComponentStore;
};

export const defaultItemStore: ItemStore = {
  craftComponents: defaultComponentStore,
};
