import { useAdvanceTime, useTime } from "../../../data/time/hooks";
import { isDay } from "../../../data/time/season-util";
import { useHandleExploration } from "../../../data/exploration/hooks";
import { useHandleSkillCheck } from "../../../data/encounters/hooks";
import { useSkills } from "../../../data/skills/hooks";
import TooltipWrapper from "../../../style/TooltipWrapper";
import { useState } from "preact/hooks";

const LakeLocation = () => {
  const [feedbackMessage, setFeedback] = useState<string | undefined>();
  const { exploration, mutateExploration, modifyActions } = useHandleExploration();
  const { time, day } = useTime();
  const advanceTime = useAdvanceTime();
  const isNight = !isDay(time, day);
  const handleSkillCheck = useHandleSkillCheck();
  const { skills } = useSkills();

  const { actions, inventory } = exploration;
  const hasJar = (inventory.jar ?? 0) > 0;
  const hasMeditationLevel = skills.meditation.level > 0;

  const handleMeditate = () => {
    const result = handleSkillCheck({ skill: ["meditation"], dc: isNight ? 7 : 5 });
    advanceTime(2); // 2 hours
    modifyActions(-1);
    setFeedback(
      result === "success"
        ? "You find some inner peace while meditating."
        : "You are too distracted, and can't calm down.",
    );
    console.info(`Meditation ${result}`);
  };

  const handleCatchFireflies = () => {
    console.info("Catching fireflies...");
  };

  const handleLeave = () => {
    mutateExploration({ location: undefined });
  };

  return (
    <div>
      <h2>{isNight ? "The lake at night" : "A large lake"}</h2>
      <span>
        Actions: {actions.cur}/{actions.max}
      </span>
      <img
        src={isNight ? "./lake_night2.jfif" : "./lake2.jfif"}
        width="300px"
        style={{ paddingRight: "20px", float: "left", margin: "-6px -12px" }}
      ></img>
      <p>
        {isNight
          ? "The lake lies still under the night sky. Stars shimmer on the dark water like scattered embers, and the moon traces a silver path across the surface."
          : "You step out from the trees to a spectacular view. A large lake is hidden in the middle of the forest."}
      </p>
      {feedbackMessage && <p>{feedbackMessage}</p>}
      <div style={{ marginTop: "1rem" }}>
        <button onClick={handleLeave} style={{ marginRight: "0.5rem" }}>
          Leave
        </button>
        <TooltipWrapper
          description={hasMeditationLevel ? `Skill check vs. DC ${isNight ? 7 : 5}` : ""}
          inline
        >
          <button
            disabled={actions.cur < 1}
            onClick={handleMeditate}
            style={{ marginRight: "0.5rem" }}
          >
            {hasMeditationLevel
              ? isNight
                ? "Meditate under the stars"
                : "Sit and meditate"
              : isNight
                ? "Sit and watch the stars"
                : "Sit and admire the view"}
          </button>
        </TooltipWrapper>
        {isNight && (
          <TooltipWrapper description={hasJar ? "Catch fireflies" : "You need a jar"} inline>
            <button disabled={!hasJar} onClick={handleCatchFireflies}>
              Catch fireflies
            </button>
          </TooltipWrapper>
        )}
      </div>
    </div>
  );
};

export default LakeLocation;
