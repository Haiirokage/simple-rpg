import type { HumanInstance } from "./creature-types";

export type NPCStore = Record<string, HumanInstance>;

export const defaultNPCStore: NPCStore = {};
