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
  complexity?: number;
};

export const CLEAR_GROUND_ACTION: ActionDefinition = {
  id: "clearGround",
  name: "Clear ground",
  timeCost: 8,
  energyCost: 70,
};
