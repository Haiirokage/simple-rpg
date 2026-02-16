import { npcQuery } from "../npc/npc-hooks";
import { acuityQuery } from "./acuity/hooks";
import { attributesQuery } from "./attributes/hooks";
import { discoveriesQuery } from "./discoveries/hooks";
import { encounterQuery } from "./encounters/hooks";
import { equipmentQuery } from "./equipment/hooks";
import { eventLogQuery } from "./eventLog/hooks";
import { explorationQuery } from "./exploration/hooks";
import { homeUpgradesQuery } from "./homeUpgrades/hooks";
import { knowledgeQuery } from "./knowledge/hooks";
import { playerStatusQuery } from "./playerStatus/hooks";
import { resourcesQuery } from "./resources/hooks";
import { skillsQuery } from "./skills/hooks";
import { structuresQuery } from "./structures/hooks";
import { timeQuery } from "./time/hooks";

export const storeQueries = [
  acuityQuery,
  attributesQuery,
  discoveriesQuery,
  encounterQuery,
  equipmentQuery,
  eventLogQuery,
  explorationQuery,
  homeUpgradesQuery,
  knowledgeQuery,
  npcQuery,
  playerStatusQuery,
  resourcesQuery,
  skillsQuery,
  structuresQuery,
  timeQuery,
];
