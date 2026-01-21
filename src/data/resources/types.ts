export const defaultResourceStore = {
  berry: 10,
  wood: 0,
  stone: 0,
  rabbitMeat: 0,
  venison: 0,
  jerky: 0,
  fiber: 0,
  hide: 0,
  leather: 0,
  tuber: 0,
} as const;

export type ResourceKeys = keyof typeof defaultResourceStore;

export type ResourceStore = Record<ResourceKeys, number>;

export type ResourceCost = Partial<ResourceStore>;
