export const resourceRecord = {
  berry: 0,
  wood: 0,
  stone: 0,
  rabbitMeat: 0,
  venison: 0,
  jerky: 0,
  fiber: 0,
  hide: 0,
  leather: 0,
  tuber: 0,
  fur: 0,
  iron: 0,
  charcoal: 0,
  copperOre: 0,
  copperBar: 0,
  jar: 0,
  // Currency
  coin: 0,
};

export const defaultResourceStore = {
  ...resourceRecord,
  berry: 10,
} as const;

export type ResourceKeys = keyof typeof defaultResourceStore;

export type ResourceStore = Record<ResourceKeys, number>;

export type ResourceCost = Partial<ResourceStore>;
