import { useState } from "preact/hooks";
import type { CreatureInstance, LootEntry } from "../../npc/creature-definitions";
import { useHandleEncounter, useSetEncounter, useSkillRoll } from "../../data/encounters/hooks";
import { useHandleExploration } from "../../data/exploration/hooks";
import { useHandleDiscoveries } from "../../data/discoveries/hooks";
import { useGrantSkillExperience } from "../../data/skills/hooks";
import { getExpRewardByDC } from "../../data/leveling-util";
import { useHandlePlayerStatus } from "../../data/playerStatus/hooks";
import { useEquipment } from "../../data/equipment/hooks";
import TooltipWrapper from "../../style/TooltipWrapper";
import { mergeNumericRecords, objectEntries } from "../../util";
import type { ResourceStore } from "../../data/resources/types";
import type { CombatConfig } from "../../data/encounters/types";

interface Props {
  enemies: Record<string, CreatureInstance>;
  combatContext?: CombatConfig;
}

const CombatResolution = ({ enemies, combatContext }: Props) => {
  const setEncounter = useSetEncounter();
  const { encounter, mutateEncounter } = useHandleEncounter();
  const { exploration, mutateExploration } = useHandleExploration();
  const { updateDiscovery } = useHandleDiscoveries();
  const skillRoll = useSkillRoll();
  const grantExperience = useGrantSkillExperience();
  const { updatePlayerStatus } = useHandlePlayerStatus();
  const equipment = useEquipment();
  const [loot, setLoot] = useState<[string, number][]>([]);
  const noKnife = !equipment.tools.knife;

  const onKill = combatContext?.onKill;
  const butchered = loot.length > 0;

  const handleButcher = () => {
    const { roll, bonus } = skillRoll({ skill: ["hunter"], knowledge: true });
    const total = roll + bonus;

    const allLootEntries = Object.values(enemies).reduce<LootEntry[]>(
      (entries, enemy) => [...entries, ...enemy.loot],
      [],
    );

    const successfulEntries = allLootEntries.filter((entry) => total >= (entry.dc ?? 0));

    const totalLoot = successfulEntries.reduce<Partial<ResourceStore>>(
      (acc, entry) => mergeNumericRecords(acc, entry.resources),
      {},
    );

    const lootEntries = objectEntries(totalLoot).filter(([, v]) => v && v > 0);
    setLoot(lootEntries as [string, number][]);

    const newInventory = mergeNumericRecords(exploration.inventory, totalLoot);

    mutateExploration({ inventory: newInventory });
    mutateEncounter({ timePassed: encounter.timePassed + 60 });
    updatePlayerStatus({ energy: -5 });

    if (onKill?.discovery) {
      updateDiscovery(onKill.discovery);
    }

    const beatenDCs = successfulEntries.filter((entry) => entry.dc).map((entry) => entry.dc!);
    if (beatenDCs.length > 0) {
      const maxDc = Math.max(...beatenDCs);
      const expReward = getExpRewardByDC(maxDc);
      grantExperience({ hunter: expReward });
    }

    console.info(`Loot roll: ${roll} + ${bonus} = ${total}`);
  };

  const handleLeave = () => {
    if (onKill?.frameId) {
      setEncounter(onKill.frameId);
    } else {
      setEncounter("exit", undefined, "You defeated your enemies.");
    }
  };

  return (
    <div>
      <p>All enemies defeated.</p>
      {butchered && (
        <div>
          <p>Loot:</p>
          <ul>
            {loot.map(([resource, amount]) => (
              <li key={resource}>
                {amount} {resource}
              </li>
            ))}
          </ul>
        </div>
      )}
      {!butchered && (
        <TooltipWrapper description={noKnife ? "You need a knife" : "Butcher the kill"} inline>
          <button disabled={noKnife} onClick={handleButcher}>
            Butcher (1h, 5 energy)
          </button>
        </TooltipWrapper>
      )}
      <button onClick={handleLeave}>
        {butchered ? "Collect and leave" : onKill?.frameId ? "Continue" : "Leave"}
      </button>
    </div>
  );
};

export default CombatResolution;
