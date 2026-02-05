import { useDataQuery, useUpdateData } from "../util";
import type { EncounterStore, EncounterFrameId, SkillCheck, CombatOutcome } from "./types";
import { ENCOUNTER_FRAMES } from "./definitions";
import { CREATURES } from "../../npc/creature-definitions";
import { useGetOrCreateNPC } from "../../npc/npc-hooks";
import { useHandleKnowledge } from "../knowledge/hooks";
import { useAttributes } from "../attributes/hooks";
import { useCallback } from "preact/hooks";
import { useGrantSkillExperience, useSkills } from "../skills/hooks";
import { getAttributeBySkill } from "../skills/definitions";
import { getExpRewardByDC } from "../leveling-util";
import { useAdvanceTime } from "../time/hooks";
import { useHandlePlayerStatus } from "../playerStatus/hooks";
import type {
  CreatureDefinition,
  CreatureIntance as CreatureInstance,
} from "../../npc/creature-definitions";
import type { AtLeast } from "../../util";
import type { Skills } from "../skills/types";
import { sum } from "lodash";

export const defaultEncounterStore: EncounterStore = {
  active: false,
  biome: "forest",
  enemies: {},
  npcs: [],
  timePassed: 0,
} as const;

export const useEncounter = () => {
  return useDataQuery<EncounterStore>("ENCOUNTERS", defaultEncounterStore);
};

export const useUpdateEncounter = () => {
  return useUpdateData<EncounterStore>("ENCOUNTERS", defaultEncounterStore);
};

export const useHandleEncounter = () => {
  const { data: encounter } = useEncounter();
  const { mutate } = useUpdateEncounter();

  return { encounter, mutateEncounter: mutate };
};

const createCreatureInstance = (
  definition: CreatureDefinition,
  config: { id?: string; distance?: number; hostile?: boolean; discovered?: boolean } = {},
): CreatureInstance => {
  return {
    ...definition,
    id: config.id || `${definition.type}1`,
    distance: config.distance ?? 100,
    health: 100,
    maxHealth: 100,
    hostile: config.hostile ?? false,
    discovered: config.discovered || false,
  };
};

export const useUpdateEnemies = () => {
  const { mutateEncounter, encounter } = useHandleEncounter();

  return (enemyStates: AtLeast<CreatureInstance, "id">[]) => {
    mutateEncounter({
      enemies: enemyStates.reduce((acc, e) => {
        return { ...acc, [e.id]: { ...acc[e.id], ...e } };
      }, encounter.enemies),
    });
  };
};

/**
 * Hook to start an encounter at a specific frame.
 * Sets the encounter as active and sets the initial frame.
 */
export const useSetEncounter = () => {
  const { mutateEncounter, encounter } = useHandleEncounter();
  const advanceTime = useAdvanceTime();
  const { updatePlayerStatus } = useHandlePlayerStatus();
  const getOrCreateNPC = useGetOrCreateNPC();

  return (startFrameId: EncounterFrameId | "exit", timePassed = 0, exitMessage?: string) => {
    const timePassedTotal = encounter.timePassed + timePassed;
    if (startFrameId === "exit") {
      const hoursPassed = Math.round(timePassedTotal / 60);
      if (hoursPassed > 0) {
        advanceTime(hoursPassed);
      }
      const returnEnergy = Math.ceil((timePassed * 5) / 60);
      if (returnEnergy > 0) {
        updatePlayerStatus({ energy: -returnEnergy });
      }
      mutateEncounter({
        active: false,
        encounterFrameId: undefined,
        enemies: {},
        npcs: [],
        combatContext: undefined,
        timePassed: 0,
        exitMessage: exitMessage,
      });

      return;
    }

    const frame = ENCOUNTER_FRAMES[startFrameId];
    const npcs = frame.npc ? [getOrCreateNPC(frame.npc.id, frame.npc.type).id] : [];

    mutateEncounter({
      active: true,
      encounterFrameId: startFrameId,
      npcs,
      timePassed: timePassedTotal,
      exitMessage: undefined,
    });
  };
};

export const useInitiateCombat = () => {
  const { mutateEncounter } = useHandleEncounter();

  return (combatOutcome: CombatOutcome) => {
    const { spawnCreatures, combatConfig } = combatOutcome;
    const enemies = spawnCreatures.reduce(
      (acc, config) => {
        const definition = CREATURES[config.type];
        return {
          ...acc,
          [config.id]: createCreatureInstance(definition, config),
        };
      },
      {} as Record<string, CreatureInstance>,
    );

    mutateEncounter({
      encounterFrameId: undefined,
      enemies,
      combatContext: combatConfig,
    });
  };
};

const KNOWLEDGE_SCALE = 50;

/**
 * Hook that returns a function to roll d6 + skill/attribute/knowledge bonuses.
 *
 * bonus from levels(1-100) is sqrt(level) / 2, this gives the same 5 bonus at level 100 as level / 20, but earlier levels give a larger bonus
 */
export const useSkillRoll = () => {
  const { data } = useEncounter();
  const { biome } = data;
  const { knowledge } = useHandleKnowledge(biome);
  const { skills } = useSkills();
  const { attributes } = useAttributes();

  return useCallback(
    (config: Pick<SkillCheck, "skill" | "knowledge">) => {
      const roll = Math.floor(Math.random() * 6) + 1;

      const { level, tier } = knowledge;
      const score = tier * 100 + level;
      const knowledgeBonus = config.knowledge ? Math.floor(score / KNOWLEDGE_SCALE) - 1 : 0;

      const skillBonus = config.skill.reduce(
        (acc, skill) => {
          const connectedAttribute = getAttributeBySkill(skill);
          const attributeLevel = attributes[connectedAttribute].level;
          const { level } = skills[skill];
          return {
            ...acc,
            [skill]: Math.floor(Math.sqrt(level) / 2) + Math.floor(attributeLevel / 20),
          };
        },
        {} as Record<Skills, number>,
      );

      console.info("bonus:", skillBonus);
      const bonus = knowledgeBonus + sum(Object.values(skillBonus));
      return { roll, bonus, skillBonus, knowledgeBonus };
    },
    [knowledge, attributes, skills],
  );
};

/**
 * Hook that returns a function to resolve skill checks.
 * Returns "success" or "failure" based on d6 roll + bonuses vs DC.
 */
export const useHandleSkillCheck = () => {
  const skillRoll = useSkillRoll();
  const { data } = useEncounter();
  const { biome } = data;
  const { knowledge, gainLevels } = useHandleKnowledge(biome);
  const grantExperience = useGrantSkillExperience();

  return useCallback(
    (skillCheck: SkillCheck): "success" | "failure" => {
      const { roll, bonus, skillBonus, knowledgeBonus } = skillRoll(skillCheck);
      const success = roll + bonus >= skillCheck.dc;

      console.info(`Roll:${roll} + Bonus:${bonus} vs DC:${skillCheck.dc}`);
      if (success) {
        skillCheck.skill.forEach((skill) => {
          console.log(skillBonus);
          const reverseContribution = Math.floor((bonus - skillBonus[skill]) / 3);
          const expReward = Math.round(
            getExpRewardByDC(Math.max(skillCheck.dc - reverseContribution, 3)),
          );
          console.info(`Gained ${expReward} exp in ${skill} skill.`);
          grantExperience({ [skill]: expReward });
        });
        const knowledgeContribution = Math.max(0.1, knowledgeBonus / bonus);
        if (skillCheck.dc / 5 >= knowledge.tier) {
          const levels = 1 + skillCheck.dc / 5 - knowledge.tier;
          console.info(`Gained ${Math.round(levels / knowledgeContribution)} knowledge levels.`);
          gainLevels(Math.round(levels / knowledgeContribution));
        }
      }
      return success ? "success" : "failure";
    },
    [skillRoll, knowledge, grantExperience, gainLevels],
  );
};
