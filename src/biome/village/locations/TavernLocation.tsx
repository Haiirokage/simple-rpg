import { useHandleExploration } from "../../../data/exploration/hooks";
import { useTime, useUpdateTime } from "../../../data/time/hooks";
import { usePlayerRegenRates, useHandlePlayerStatus } from "../../../data/playerStatus/hooks";
import { getSeasonByDay } from "../../../data/time/season-util";
import CurrencyDisplay from "../../../components/CurrencyDisplay";

const LODGING_COST = 40;

const TavernLocation = () => {
  const { exploration, mutateExploration } = useHandleExploration();
  const { time, day } = useTime();
  const updateTime = useUpdateTime();
  const { playerStatus, updatePlayerStatus } = useHandlePlayerStatus();
  const { energyRegen } = usePlayerRegenRates();

  const { actions, lodging, inventory } = exploration;
  const villageLodging = lodging.village;
  const coins = inventory.coin ?? 0;

  const handleLeave = () => {
    mutateExploration({ location: undefined });
  };

  const handlePayLodging = () => {
    mutateExploration({
      inventory: { ...inventory, coin: coins - LODGING_COST },
      lodging: { ...lodging, village: { location: "tavern", nutritionLevel: 2 } },
    });
  };

  const handleRest = () => {
    const nextDay = day + 1;
    const month = getSeasonByDay(nextDay);
    const wakeupTime = 24 + month.sunrise;
    updatePlayerStatus({
      energy: Math.floor(energyRegen * (wakeupTime - time) * playerStatus.satiation),
    });
    updateTime({ time: wakeupTime });
    mutateExploration({ lodging: { ...lodging, village: undefined } });
  };

  return (
    <div>
      <h2>The Village Tavern</h2>
      <span>
        Actions: {actions.cur}/{actions.max}
      </span>
      <p>
        The tavern is warm and inviting. The smell of ale and roasted meat fills the air. A few
        locals sit at wooden tables, chatting quietly. The barkeep nods at you from behind the
        counter.
      </p>
      <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
        <button onClick={handleLeave}>Leave</button>
        {villageLodging ? (
          <button onClick={handleRest}>Rest for the night</button>
        ) : (
          <button disabled={coins < LODGING_COST} onClick={handlePayLodging}>
            Pay for lodging (<CurrencyDisplay amount={LODGING_COST} />)
          </button>
        )}
      </div>
    </div>
  );
};

export default TavernLocation;
