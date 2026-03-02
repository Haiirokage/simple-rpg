import type { ComponentStore, CraftComponentType, MetalEntry, MetalMaterial } from "./types";
import { MATERIAL_WEIGHTS, CASTING_DEFINITIONS } from "./definitions";
import { addNumericRecords, objectEntries, subtractNumericRecords } from "../../util";

export const getCraftComponentLabel = (
  componentType: CraftComponentType,
  material: string,
): string => {
  const def = CASTING_DEFINITIONS[componentType];
  return `${material} ${(def?.label ?? componentType).toLowerCase()}`;
};

export const moldToAscii = (mold: boolean[][]): string =>
  mold.map((row) => row.map((cell) => (cell ? "X" : " ")).join(" ")).join("\n");

export const getMetalEntryWeight = (entry: MetalEntry): number =>
  (Object.keys(MATERIAL_WEIGHTS) as MetalMaterial[]).reduce(
    (total, material) => total + entry[material] * MATERIAL_WEIGHTS[material],
    0,
  );

export const getTotalCraftComponentsWeight = (components: ComponentStore): number =>
  objectEntries(components).reduce((total, [, entry]) => total + getMetalEntryWeight(entry), 0);

type ComponentDelta = Partial<Record<CraftComponentType, Partial<Record<MetalMaterial, number>>>>;

/** Apply a delta to a ComponentStore. Pass subtract=true to remove instead of add. */
export const addComponents = (
  store: ComponentStore,
  delta: ComponentDelta,
  subtract = false,
): ComponentStore =>
  objectEntries(delta).reduce<ComponentStore>(
    (acc, [componentType, materialDelta]) => ({
      ...acc,
      [componentType]: subtract
        ? subtractNumericRecords(acc[componentType], materialDelta)
        : addNumericRecords(acc[componentType], materialDelta),
    }),
    store,
  );
