import { makeDataQuery, useDefinedQuery, useUpdateData } from "../util";
import { defaultItemStore, type ItemStore } from "./types";
import { MATERIAL_WEIGHTS } from "../craftComponents/definitions";
import type { ComponentStore, MetalMaterial } from "../craftComponents/types";
import { addComponents } from "../craftComponents/util";
import { objectEntries } from "../../util";

export const itemsQuery = makeDataQuery("ITEMS", defaultItemStore);

export const useItems = () => {
  const { data } = useDefinedQuery(itemsQuery);
  return data;
};

export const useUpdateItemComponents = () => {
  const items = useItems();
  const { mutate } = useUpdateData<ItemStore>("ITEMS", defaultItemStore);
  return (delta: Parameters<typeof addComponents>[1], subtract = false) =>
    mutate({ craftComponents: addComponents(items.craftComponents, delta, subtract) });
};

export const hasStoredComponents = (components: ComponentStore): boolean =>
  objectEntries(components).some(([, entry]) =>
    (Object.keys(MATERIAL_WEIGHTS) as MetalMaterial[]).some((mat) => entry[mat] > 0),
  );
