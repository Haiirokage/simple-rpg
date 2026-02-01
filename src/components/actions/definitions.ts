import type { ActionCost } from "./types";

export type ActionDefinition = {
  id: string;
  name: string;
  cost: ActionCost;
};

export const CLEAR_GROUND_ACTION: ActionDefinition = {
  id: "clearGround",
  name: "Clear ground",
  cost: { time: 8, energy: 70 },
};
