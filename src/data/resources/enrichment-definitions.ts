import type { ResourceCost, ResourceKeys } from "./types";

interface EnrichmentDefinition {
  cost: ResourceCost;
  result: ResourceCost;
  timeCost: number;
  energyCost: number;
}

export const ENRICHMENT: Partial<Record<ResourceKeys, EnrichmentDefinition>> = {
  leather: {
    cost: { hide: 1, wood: 2 },
    result: { leather: 2 },
    timeCost: 2,
    energyCost: 5,
  },
};

export const LEATHER_ENRICHMENT = {
  cost: { hide: 1, wood: 2 },
  timeCost: 2,
  energyCost: 5,
};

export const FIREWOOD_ENRICHMENT = {
  cost: { wood: 1 },
  result: { firewood: 10 },
  timeCost: 1,
  energyCost: 8,
};

export const CHARCOAL_ENRICHMENT = {
  cost: { firewood: 20 },
  result: { charcoal: 10 },
  timeCost: 10,
  energyCost: 35,
};
