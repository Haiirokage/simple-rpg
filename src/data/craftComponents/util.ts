import type { ComponentStore, MetalEntry, MetalMaterial } from "./types";
import { MATERIAL_WEIGHTS, CASTING_DEFINITIONS } from "./definitions";
import { objectEntries } from "../../util";

export const getCraftComponentLabel = (componentType: string, material: string): string => {
  const def = CASTING_DEFINITIONS.find((d) => d.type === componentType);
  return `${material} ${(def?.label ?? componentType).toLowerCase()}`;
};

export const getMetalEntryWeight = (entry: MetalEntry): number =>
  (Object.keys(MATERIAL_WEIGHTS) as MetalMaterial[]).reduce(
    (total, material) => total + entry[material] * MATERIAL_WEIGHTS[material],
    0,
  );

export const getTotalCraftComponentsWeight = (components: ComponentStore): number =>
  objectEntries(components).reduce((total, [, entry]) => total + getMetalEntryWeight(entry), 0);
