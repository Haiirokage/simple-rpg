import type { EncounterFrame, EncounterFrameId } from "./types";
import { FOREST_ENCOUNTERS } from "../../biome/forest/encounter-definitions";
import { VILLAGE_ENCOUNTERS } from "../../biome/village/encounter-definitions";

export const ENCOUNTER_FRAMES: Record<EncounterFrameId, EncounterFrame> = {
  ...FOREST_ENCOUNTERS,
  ...VILLAGE_ENCOUNTERS,
};
