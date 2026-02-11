import { useHandleAttack } from "../../combat/hooks";
import { ENCOUNTER_FRAMES } from "../../data/encounters/definitions";
import {
  useSetEncounter,
  useHandleSkillCheck,
  useHandleEncounter,
  useInitiateCombat,
} from "../../data/encounters/hooks";
import type { EncounterAction, Outcome } from "../../data/encounters/types";
import { useHandleExploration } from "../../data/exploration/hooks";
import { mergeNumericRecords } from "../../util";
import { useHandlePlayerStatus } from "../../data/playerStatus/hooks";
import { useEquipment } from "../../data/equipment/hooks";
import { useMutateDiscoveries } from "../../data/discoveries/hooks";
import { useHandleEffect } from "../../data/effect-util";
import { useSkills } from "../../data/skills/hooks";
import TooltipWrapper from "../../style/TooltipWrapper";
import { objectKeys } from "../../util";
import CombatView from "./CombatView";
import NPCInteractionView from "./NPCInteractionView";
import DiscoverySplash from "./DiscoverySplash";
import { EXPLORATION_EVENTS } from "../../events/exploration-events";

const EncounterView = () => {
  const { encounter, mutateEncounter } = useHandleEncounter();
  const { exploration, mutateExploration } = useHandleExploration();
  const mutateDiscoveries = useMutateDiscoveries();
  const equipment = useEquipment();
  const { playerStatus, updatePlayerStatus } = useHandlePlayerStatus();
  const setEncounter = useSetEncounter();
  const handleSkillCheck = useHandleSkillCheck();
  const handleAttack = useHandleAttack();
  const handleEffect = useHandleEffect();
  const initiateCombat = useInitiateCombat();
  const { skills } = useSkills();

  const enemies = objectKeys(encounter.enemies);

  if (enemies.length > 0) {
    return <CombatView enemies={encounter.enemies} />;
  }
  if (encounter.encounteredDiscovery) {
    const event = EXPLORATION_EVENTS[encounter.encounteredDiscovery];
    if (event) {
      return <DiscoverySplash event={event} />;
    }
  }
  if (encounter.npcs.length > 0) {
    return <NPCInteractionView />;
  }
  if (!encounter.encounterFrameId) {
    return <div>{encounter.exitMessage || "No encounter active."}</div>;
  }
  const frame = ENCOUNTER_FRAMES[encounter.encounterFrameId];

  const resolveOutcome = (outcome: Outcome, timePassed?: number) => {
    const { resourceYield, discovery, sideEffect } = outcome;

    if (sideEffect) {
      handleEffect(sideEffect);
    }
    if (resourceYield) {
      const newInventory = mergeNumericRecords(exploration.inventory, resourceYield);
      mutateExploration({ inventory: newInventory });
    }
    if (discovery) {
      mutateDiscoveries({ [discovery]: 1 });
    }

    if (outcome.nextFrameId === "combat") {
      initiateCombat(outcome);
    } else {
      setEncounter(outcome.nextFrameId, timePassed, outcome.exitMessage);
    }
  };

  const handleActionClick = (action: EncounterAction) => {
    if (action.cost.energy) {
      updatePlayerStatus({ energy: -action.cost.energy });
    }
    if (action.type === "skill") {
      const outcome = action.skillCheck ? handleSkillCheck(action.skillCheck) : "success";

      resolveOutcome(action.outcomes[outcome], action.cost.minutes);
    }
    if (action.type === "attack") {
      const target = encounter.enemies[action.attack.target];
      const result = handleAttack(target, "body");
      if (result !== "failure") {
        const newHealth = Math.max(0, target.health - result.healthLost);
        mutateEncounter({
          enemies: {
            ...encounter.enemies,
            [action.attack.target]: { ...target, health: newHealth },
          },
        });
        if (newHealth <= 0) {
          resolveOutcome(action.outcomes.success);
        } else {
          resolveOutcome(action.outcomes.failure);
        }
        console.info(
          `(${result.hitSeverity}) Dealt ${result.healthLost} damage to ${action.attack.target}`,
        );
      }
    }
  };

  return (
    <div>
      <h2>{frame.title}</h2>
      <p>{frame.description}</p>
      <div style={{ marginTop: "1rem" }}>
        {!frame.preventLeaving && (
          <button
            onClick={() => {
              setEncounter("exit");
            }}
            style={{ marginRight: "0.5rem" }}
          >
            Leave
          </button>
        )}
        {frame.actions.map((action) => {
          const outOfEnergy = playerStatus.energy - (action.cost.energy || 0) < 0;
          const noWeapon = action.type === "attack" && !equipment.tools.bow;

          const hasSkillLevel =
            action.type === "skill" && action.skillCheck.skill.some((s) => skills[s].level > 0);
          const showCover = action.type === "skill" && action.coverLabel && !hasSkillLevel;

          const message =
            action.type === "skill" && !showCover
              ? `Skill check vs. DC ${action.skillCheck.dc}`
              : "";

          return (
            <TooltipWrapper description={noWeapon ? "You need a weapon" : message} inline>
              <button
                disabled={outOfEnergy || noWeapon}
                onClick={() => handleActionClick(action)}
                key={action.id}
                style={{ marginRight: "0.5rem" }}
              >
                {showCover ? action.coverLabel : action.label}
              </button>
            </TooltipWrapper>
          );
        })}
      </div>
    </div>
  );
};

export default EncounterView;
