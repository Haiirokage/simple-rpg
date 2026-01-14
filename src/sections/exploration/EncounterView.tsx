import { useHandleAttack } from "../../combat/hooks";
import { ENCOUNTER_FRAMES } from "../../data/encounters/definitions";
import {
  useSetEncounter,
  useHandleSkillCheck,
  useHandleEncounter,
} from "../../data/encounters/hooks";
import type { EncounterAction, Outcome } from "../../data/encounters/types";
import { useExploration } from "../../data/exploration/hooks";
import { useHandleResources } from "../../data/resources/hooks";
import { useTime } from "../../data/time/hooks";
import { useHandlePlayerStatus } from "../../data/playerStatus/hooks";
import { useEquipment } from "../../data/equipment/hooks";
import { useMutateDiscoveries } from "../../data/discoveries/hooks";
import { useHandleEffect } from "../../data/effect-util";
import TooltipWrapper from "../../style/TooltipWrapper";

const EncounterView = () => {
  const { encounter, mutateEncounter } = useHandleEncounter();
  const exploration = useExploration();
  const mutateDiscoveries = useMutateDiscoveries();
  const equipment = useEquipment();
  const { time } = useTime();
  const { addResources } = useHandleResources();
  const { playerStatus, updatePlayerStatus } = useHandlePlayerStatus();
  const setEncounter = useSetEncounter();
  const handleSkillCheck = useHandleSkillCheck();
  const handleAttack = useHandleAttack();
  const handleEffect = useHandleEffect();

  if (!encounter.encounterFrameId) {
    return <div>{encounter.exitMessage || "No encounter active."}</div>;
  }
  const frame = ENCOUNTER_FRAMES[encounter.encounterFrameId];

  const resolveOutcome = (outcome: Outcome, timePassed?: number) => {
    const { nextFrameId, resourceYield, exitMessage, discovery, sideEffect } = outcome;

    if (sideEffect) {
      handleEffect(sideEffect);
    }
    if (resourceYield) {
      addResources(resourceYield);
    }
    if (discovery) {
      mutateDiscoveries({ [discovery]: 1 });
    }

    setEncounter(nextFrameId, timePassed, exitMessage);
  };

  const handleActionClick = (action: EncounterAction) => {
    if (action.cost.energy) {
      updatePlayerStatus({ energy: -action.cost.energy });
    }
    const { npcs } = encounter;
    if (action.type === "skill") {
      const outcome = action.skillCheck ? handleSkillCheck(action.skillCheck) : "success";

      resolveOutcome(action.outcomes[outcome], action.cost.minutes);
    }
    if (action.type === "attack") {
      const targetNPC = npcs[action.attack.target];
      const result = handleAttack(encounter.npcs[action.attack.target], "body");
      if (result !== "failure") {
        const npcHealth = targetNPC.health - result.healthLost;
        mutateEncounter({
          npcs: {
            ...npcs,
            [action.attack.target]: {
              ...targetNPC,
              health: Math.max(0, npcHealth),
            },
          },
        });
        if (npcHealth <= 0) {
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

  const timeLeft = exploration.endTime - time;

  const isOutOfTime = (duration: number = 0) =>
    timeLeft - Math.floor((encounter.timePassed + duration) / 60) < 0;

  return (
    <div>
      <h2>{frame.title}</h2>
      <p>{frame.description}</p>
      {isOutOfTime() && <p>You have run out of time and must return home to replenish.</p>}
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
          const outOfTime = isOutOfTime(action.cost.minutes);
          const outOfEnergy = playerStatus.energy - (action.cost.energy || 0) < 0;
          const noWeapon = action.type === "attack" && equipment.tools.bow.level !== 1;

          const message =
            action.type === "skill" ? `Skill check vs. DC ${action.skillCheck.dc}` : "Attack roll";

          return (
            <TooltipWrapper description={message} inline>
              <button
                disabled={outOfTime || outOfEnergy || noWeapon}
                onClick={() => handleActionClick(action)}
                key={action.id}
                style={{ marginRight: "0.5rem" }}
              >
                {action.label}
              </button>
            </TooltipWrapper>
          );
        })}
      </div>
    </div>
  );
};

export default EncounterView;
