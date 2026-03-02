export type MetalMaterial = "copper";
export type CraftComponentMaterial = MetalMaterial;
export type CraftComponentType = keyof ComponentStore;

export type MetalEntry = { type: "metal" } & Record<MetalMaterial, number>;

export type ComponentCost = Partial<
  Record<CraftComponentType, Partial<Record<MetalMaterial, number>>>
>;

export type ComponentStore = {
  bar: MetalEntry;
  knifeBlade: MetalEntry;
  axeHead: MetalEntry;
  pickHead: MetalEntry;
  swordBlade: MetalEntry;
};

export const defaultComponentStore: ComponentStore = {
  bar: { type: "metal", copper: 0 },
  knifeBlade: { type: "metal", copper: 0 },
  axeHead: { type: "metal", copper: 0 },
  pickHead: { type: "metal", copper: 0 },
  swordBlade: { type: "metal", copper: 0 },
};
