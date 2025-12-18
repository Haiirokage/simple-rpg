import { usePlayerStatus } from "../data/playerStatus/hooks";
import ProgressBar from "../components/ProgressBar";

const PlayerStatus = () => {
  const { data: status } = usePlayerStatus();

  return (
    <div>
      <h2>Status</h2>
      <div style={{ marginBottom: "0.5rem" }}>
        <ProgressBar
          current={status.energy}
          max={status.maxEnergy}
          label="Energy"
          color="#64b5f6"
        />
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
