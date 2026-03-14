import { useState } from "preact/hooks";
import { useHandleExploration } from "../../../data/exploration/hooks";
import { useTime, useUpdateTime } from "../../../data/time/hooks";
import { usePlayerRegenRates, useHandlePlayerStatus } from "../../../data/playerStatus/hooks";
import { getSeasonByDay } from "../../../data/time/season-util";
import { useGrantExperience, useAttributes } from "../../../data/attributes/hooks";
import { getExpThreshold } from "../../../data/leveling-util";
import ExplorationCostButton from "../../../components/ExplorationCostButton";
import { useNPCsAtLocation } from "../../../npc/npc-hooks";
import NPCInteractionView from "../../../sections/exploration/NPCInteractionView";

const LODGING_COST = 35;
const DRINK_COST = 7;
const DRINK_HOURS = 2;
const DRINK_ENERGY = 5;

type TavernEvent = {
  title: string;
  /** Charisma level at which success is guaranteed. Below this, success probability = (charisma / threshold)^2 */
  charismaThreshold: number;
  setup: string;
  successText: string;
  failureText: string;
  failureDamage?: number;
};

const TAVERN_EVENTS: TavernEvent[] = [
  {
    title: "A Drunkard Picks a Fight",
    charismaThreshold: 20,
    setup:
      "A large, red-faced man stumbles over to your table and starts jabbing his finger at you, muttering something about your face.",
    successText:
      "You keep your tone steady and your expression open. After a tense moment he grunts, loses interest, and lumbers back to his stool.",
    failureText:
      "You fumble for words and he takes it as an insult. A fist connects with your jaw before the barkeep hauls him away.",
    failureDamage: 8,
  },
  {
    title: "A Stranger Sits Nearby",
    charismaThreshold: 5,
    setup:
      "A young woman takes a seat at the table next to you, glancing your way with a small smile.",
    successText:
      "You exchange a few easy words and share a quiet laugh. Nothing more comes of it, but the evening feels warmer for it.",
    failureText:
      "You open your mouth and immediately say something awkward. She smiles politely and turns away.",
  },
];

type DrinkResult = {
  title: string;
  setup: string;
  outcomeText: string;
  charisma: number;
  threshold: number;
  success: boolean;
};

const TavernLocation = () => {
  const { exploration, mutateExploration } = useHandleExploration();
  const { time, day } = useTime();
  const updateTime = useUpdateTime();
  const { playerStatus, updatePlayerStatus } = useHandlePlayerStatus();
  const { energyRegen } = usePlayerRegenRates();
  const grantExperience = useGrantExperience();
  const { attributes } = useAttributes();
  const [drinkResult, setDrinkResult] = useState<DrinkResult | undefined>();
  const [talkingToId, setTalkingToId] = useState<string | undefined>();

  const { actions, lodging } = exploration;
  const villageLodging = lodging.village;

  const presentNPCs = useNPCsAtLocation("village", "tavern");
  console.log(presentNPCs);

  const handleLeave = () => {
    mutateExploration({ location: undefined });
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

  const handleDrink = () => {
    const event = TAVERN_EVENTS[Math.floor(Math.random() * TAVERN_EVENTS.length)];
    const charisma = attributes.charisma.level;
    const delta = Math.max(0, event.charismaThreshold - charisma);
    const p = 0.9 ** (delta ** 2);
    const success = Math.random() < p;

    if (success) {
      const expReward = Math.round(
        getExpThreshold(event.charismaThreshold) / (1.5 * Math.sqrt(event.charismaThreshold + 1)),
      );
      console.log("charisma exp", expReward);
      grantExperience({ charisma: expReward });
    }
    if (!success && event.failureDamage) {
      updatePlayerStatus({ health: -event.failureDamage });
    }

    setDrinkResult({
      title: event.title,
      setup: event.setup,
      outcomeText: success ? event.successText : event.failureText,
      charisma,
      threshold: event.charismaThreshold,
      success,
    });
  };

  const talkingTo = presentNPCs.find((npc) => npc.id === talkingToId);
  if (talkingTo) {
    return <NPCInteractionView npc={talkingTo} onLeave={() => setTalkingToId(undefined)} />;
  }

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
      {drinkResult && (
        <div>
          <strong>{drinkResult.title}</strong>
          <p>{drinkResult.setup}</p>
          <p>{drinkResult.outcomeText}</p>
        </div>
      )}
      <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
        <button onClick={handleLeave}>Leave</button>
        {presentNPCs.map((npc) => (
          <button key={npc.id} onClick={() => setTalkingToId(npc.id)}>
            Talk to {npc.name}
          </button>
        ))}
        {time > 14 && (
          <ExplorationCostButton
            cost={{ resources: { coin: DRINK_COST }, time: DRINK_HOURS, energy: DRINK_ENERGY }}
            onClick={handleDrink}
          >
            Go drinking
          </ExplorationCostButton>
        )}
        {time <= 14 && (
          <ExplorationCostButton
            cost={{ resources: { coin: 10 }, time: 2 }}
            onClick={() => updatePlayerStatus({ energy: 10, satiation: 2, maxSatiation: 1 })}
          >
            Eat some food
          </ExplorationCostButton>
        )}
        {villageLodging ? (
          <button onClick={handleRest}>Rest for the night</button>
        ) : (
          <ExplorationCostButton
            cost={{ resources: { coin: LODGING_COST } }}
            onClick={() =>
              mutateExploration({
                lodging: { ...lodging, village: { location: "tavern", nutritionLevel: 2 } },
              })
            }
          >
            Pay for lodging
          </ExplorationCostButton>
        )}
      </div>
    </div>
  );
};

export default TavernLocation;
