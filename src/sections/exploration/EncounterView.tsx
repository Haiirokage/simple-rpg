import { useHandleAttack } from "../../combat/hooks";
import { ENCOUNTER_FRAMES } from "../../data/encounters/definitions";
import {
  useSetEncounter,
  useHandleSkillCheck,
  useHandleEncounter,
} from "../../data/encounters/hooks";
import type { Outcome } from "../../data/encounters/types";
import { useHandleResources } from "../../data/resources/hooks";

const EncounterView = () => {
  const { encounter, mutateEncounter } = useHandleEncounter();
  const { addResources } = useHandleResources();
  const setEncounter = useSetEncounter();
  const handleSkillCheck = useHandleSkillCheck();
  const handleAttack = useHandleAttack();

  if (!encounter.encounterFrameId) {
    return <div>No encounter active.</div>;
  }
  const frame = ENCOUNTER_FRAMES[encounter.encounterFrameId];

  const resolveOutcome = (outcome: Outcome) => {
    const { nextFrameId, resourceYield } = outcome;

    if (resourceYield) {
      addResources(resourceYield);
    }

    setEncounter(nextFrameId);
  };

  const handleActionClick = (action: (typeof frame.actions)[0]) => {
    if (action.type === "skill") {
      const outcome = action.skillCheck ? handleSkillCheck(action.skillCheck) : "success";
      resolveOutcome(action.outcomes[outcome]);
    }
    if (action.type === "attack") {
      const targetNPC = encounter.npcs[action.attack.target];
      const result = handleAttack(action.attack.target, "body");
      if (result !== "failure") {
        const npcHealth = targetNPC.health - result.healthLost;
        mutateEncounter({
          npcs: {
            ...encounter.npcs,
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
        {frame.actions.map((action) => (
          <button
            onClick={() => handleActionClick(action)}
            key={action.id}
            style={{ marginRight: "0.5rem" }}
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EncounterView;
