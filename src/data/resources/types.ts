export const resourceKeys = [
  "berry",
  "wood",
  "stone",
  "rabbitMeat",
  "jerky",
  "fiber",
] as const;

export const defaultResourceStore = {
  berry: 10,
  wood: 0,
  stone: 0,
  rabbitMeat: 0,
  jerky: 0,
  fiber: 0,
} as const;

export type ResourceKeys = keyof typeof defaultResourceStore;

export type ResourceStore = Record<ResourceKeys, number>;
