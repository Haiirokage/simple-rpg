import { ENCOUNTER_FRAMES } from "../../data/encounters/definitions";
import { useEncounter, useSetEncounter, useHandleSkillCheck } from "../../data/encounters/hooks";

const EncounterView = () => {
  const { data } = useEncounter();
  const setEncounter = useSetEncounter();
  const handleSkillCheck = useHandleSkillCheck();

  if (!data.encounterFrameId) {
    return <div>No encounter active.</div>;
  }
  const frame = ENCOUNTER_FRAMES[data.encounterFrameId];

  const handleActionClick = (action: (typeof frame.actions)[0]) => {
    const outcome = action.skillCheck ? handleSkillCheck(action.skillCheck) : "success";
    const nextFrameId = action.outcomes[outcome]?.nextFrameId;
    if (nextFrameId) {
      setEncounter(nextFrameId);
    } else {
      setEncounter("exit");
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
