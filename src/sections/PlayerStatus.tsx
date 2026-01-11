import { usePlayerRegenRates, usePlayerStatus } from "../data/playerStatus/hooks";
import ProgressBar from "../components/ProgressBar";
import TooltipWrapper from "../style/TooltipWrapper";

const PlayerStatus = () => {
  const { data: status } = usePlayerStatus();
  const { energyRegen } = usePlayerRegenRates();

  return (
    <div>
      <h2>Status</h2>
      <div style={{ marginBottom: "0.5rem" }}>
        <ProgressBar
          current={status.health}
          max={status.maxHealth}
          label="Health"
          color="#e74c3c"
        />
      </div>
      <div style={{ marginBottom: "0.5rem" }}>
        <TooltipWrapper
          description={`Your energy regen is ${energyRegen.toFixed(2)} * satiation / h While resting`}
        >
          <ProgressBar
            current={status.energy}
            max={status.maxEnergy}
            label="Energy"
            color="#64b5f6"
          />
        </TooltipWrapper>
      </div>
      <div style={{ marginBottom: "0.5rem" }}>
        <ProgressBar
          current={status.satiation}
          max={status.maxSatiation}
          label="Satiation"
          color="#ffeb3b"
        />
      </div>
    </div>
  );
};

export default PlayerStatus;
