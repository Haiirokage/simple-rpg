export type MetalMaterial = "copper";
export type CraftComponentMaterial = MetalMaterial;
export type CraftComponentType = keyof ComponentStore;

export type MetalEntry = { type: "metal" } & Record<MetalMaterial, number>;

export type ComponentStore = {
  bar: MetalEntry;
  knifeBlade: MetalEntry;
};

export const defaultComponentStore: ComponentStore = {
  bar: { type: "metal", copper: 0 },
  knifeBlade: { type: "metal", copper: 0 },
};
