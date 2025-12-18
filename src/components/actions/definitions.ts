/**
 * Action definition for game actions.
 * Specifies time cost, energy cost, and optional resource cost for all player actions.
 */
import type { ResourceStore } from "../../data/resources/types";

export type ActionDefinition = {
  id: string;
  name: string;
  timeCost: number;
  energyCost: number;
  resourceCost?: Partial<ResourceStore>;
};

/**
 * Forest/outdoor action definitions.
 */
export const FOREST_ACTIONS: ActionDefinition[] = [
  {
    id: "forage",
    name: "Forage for berries",
    timeCost: 3,
    energyCost: 5,
  },
  {
    id: "gatherWood",
    name: "Gather wood",
    timeCost: 2,
    energyCost: 10,
  },
  {
    id: "gatherStone",
    name: "Gather stone",
    timeCost: 3,
    energyCost: 15,
  },
  {
    id: "setTrap",
    name: "Set trap",
    timeCost: 1,
    energyCost: 2,
    resourceCost: { berry: 4 },
  },
];

export const CLEAR_GROUND_ACTION: ActionDefinition = {
  id: "clearGround",
  name: "Clear ground",
  timeCost: 8,
  energyCost: 70,
};
