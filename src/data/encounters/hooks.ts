import { useDataQuery, useUpdateData } from "../util";
import type { EncounterStore, EncounterFrameId, SkillCheck, NPC, CombatOutcome } from "./types";
import { ENCOUNTER_FRAMES } from "./definitions";
import { CREATURES } from "../../npc/creature-definitions";
import { useHandleKnowledge } from "../knowledge/hooks";
import { useAttributes } from "../attributes/hooks";
import { useCallback } from "preact/hooks";
import { useGrantSkillExperience, useSkills } from "../skills/hooks";
import { getAttributeBySkill } from "../skills/definitions";
import { useAdvanceTime } from "../time/hooks";
import { useHandlePlayerStatus } from "../playerStatus/hooks";
import type {
  CreatureDefinition,
  CreatureIntance as CreatureInstance,
} from "../../npc/creature-definitions";
import type { AtLeast } from "../../util";

export const defaultEncounterStore: EncounterStore = {
  active: false,
  biome: "forest",
  npcs: {},
  enemies: {},
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

/**
 * Generate NPC instances from spawnCreatures config.
 */
const spawnNpcsFromFrame = (frameId: EncounterFrameId) => {
  const frame = ENCOUNTER_FRAMES[frameId];
  if (!frame.spawnCreatures) return {};

  return frame.spawnCreatures.reduce(
    (npcs, config) => ({
      ...npcs,
      [config.id]: {
        id: config.id,
        type: config.type,
        distance: config.distance,
        health: 100,
        maxHealth: 100,
        attributes: {},
        targets: {},
      },
    }),
    {} as Record<string, NPC>,
  );
};

const getNPCFromDefinition = (definition: CreatureDefinition, id?: string): CreatureInstance => {
  const npcId = id || `${definition.type}1`;
  return { ...definition, id: npcId, distance: 100, health: 100, maxHealth: 100, hostile: false };
};

export const useSpawnEnemy = () => {
  const { mutateEncounter, encounter } = useHandleEncounter();

  return (definition: CreatureDefinition) => {
    const npcId = `${definition.type}1`;
    mutateEncounter({
      enemies: {
        ...encounter.enemies,
        [npcId]: getNPCFromDefinition(definition, npcId),
        [`${npcId}1`]: getNPCFromDefinition(definition, `${npcId}1`),
      },
    });
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
        npcs: {},
        enemies: {},
        combatContext: undefined,
        timePassed: 0,
        exitMessage: exitMessage,
      });

      return;
    }
    mutateEncounter({
      active: true,
      encounterFrameId: startFrameId,
      npcs: spawnNpcsFromFrame(startFrameId),
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
          [config.id]: getNPCFromDefinition(definition, config.id),
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
 * Hook that returns a function to roll d20 + skill/attribute/knowledge bonuses.
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
      const roll = Math.floor(Math.random() * 20) + 1;

      const { level, tier } = knowledge;
      const score = tier * 100 + level;
      const knowledgeBonus = config.knowledge ? Math.floor(score / KNOWLEDGE_SCALE) : 0;

      const skillBonus = config.skill.reduce((sum, skill) => {
        const connectedAttribute = getAttributeBySkill(skill);
        const attributeLevel = attributes[connectedAttribute].level;
        const { level } = skills[skill];
        return sum + Math.floor(Math.sqrt(level) / 2) + attributeLevel / 20;
      }, 0);

      const bonus = knowledgeBonus + skillBonus;
      return { roll, bonus, skillBonus, knowledgeBonus };
    },
    [knowledge, attributes, skills],
  );
};

/**
 * Hook that returns a function to resolve skill checks.
 * Returns "success" or "failure" based on d20 roll + bonuses vs DC.
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
        const skillContribution = Math.max(0.1, skillBonus / bonus);
        const expReward = Math.round(Math.pow(1.45, skillCheck.dc) * 2 * skillContribution);
        skillCheck.skill.forEach((skill) => {
          console.info(`Gained ${expReward} exp in ${skill} skill.`);
          grantExperience({ [skill]: expReward });
        });
        const knowledgeContribution = Math.max(0.1, knowledgeBonus / bonus);
        if (skillCheck.dc / 9 >= knowledge.tier) {
          const levels = 1 + skillCheck.dc / 9 - knowledge.tier;
          console.info(`Gained ${Math.round(levels / knowledgeContribution)} knowledge levels.`);
          gainLevels(Math.round(levels / knowledgeContribution));
        }
      }
      return success ? "success" : "failure";
    },
    [skillRoll, knowledge, grantExperience, gainLevels],
  );
};
