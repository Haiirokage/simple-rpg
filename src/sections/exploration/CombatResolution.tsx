import { useEffect, useMemo } from "preact/hooks";
import { mergeWith } from "lodash";
import type { CreatureIntance, LootEntry } from "../../npc/creature-definitions";
import { useSetEncounter, useSkillRoll } from "../../data/encounters/hooks";
import { useHandleResources } from "../../data/resources/hooks";
import { useMutateDiscoveries } from "../../data/discoveries/hooks";
import { useGrantSkillExperience } from "../../data/skills/hooks";
import type { ResourceStore } from "../../data/resources/types";
import type { CombatConfig } from "../../data/encounters/types";

const addValues = (a = 0, b = 0) => a + b;

interface Props {
  enemies: Record<string, CreatureIntance>;
  combatContext?: CombatConfig;
}

const CombatResolution = ({ enemies, combatContext }: Props) => {
  const setEncounter = useSetEncounter();
  const { addResources } = useHandleResources();
  const mutateDiscoveries = useMutateDiscoveries();
  const skillRoll = useSkillRoll();
  const grantExperience = useGrantSkillExperience();

  const lootResults = useMemo(() => {
    const { roll, bonus } = skillRoll({ skill: ["hunter"], knowledge: true });
    const total = roll + bonus;

    const allLootEntries = Object.values(enemies).reduce<LootEntry[]>(
      (entries, enemy) => [...entries, ...enemy.loot],
      [],
    );

    const successfulEntries = allLootEntries.filter((entry) => total >= (entry.dc ?? 0));

    const totalLoot = successfulEntries.reduce<Partial<ResourceStore>>(
      (acc, entry) => mergeWith(acc, entry.resources, addValues),
      {},
    );

    const beatenDCs = successfulEntries.filter((entry) => entry.dc).map((entry) => entry.dc!);

    console.info(`Loot roll: ${roll} + ${bonus} = ${total}`);

    return { loot: totalLoot, beatenDCs };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onKill = combatContext?.onKill;
  const lootEntries = Object.entries(lootResults.loot).filter(([, v]) => v && v > 0);

  useEffect(() => {
    addResources(lootResults.loot);
    if (onKill?.discovery) {
      mutateDiscoveries({ [onKill.discovery]: 1 });
    }
    if (lootResults.beatenDCs.length > 0) {
      const maxDc = Math.max(...lootResults.beatenDCs);
      const expReward = Math.round(Math.pow(1.45, maxDc) * 2);
      grantExperience({ hunter: expReward });
    }
  });

  return (
    <div>
      <p>All enemies defeated.</p>
      {lootEntries.length > 0 && (
        <div>
          <p>Loot:</p>
          <ul>
            {lootEntries.map(([resource, amount]) => (
              <li key={resource}>
                {amount} {resource}
              </li>
            ))}
          </ul>
        </div>
      )}
      <button
        onClick={() => {
          if (onKill?.frameId) {
            setEncounter(onKill.frameId);
          } else {
            setEncounter("exit", undefined, "You defeated your enemies.");
          }
        }}
      >
        {onKill?.frameId ? "Continue" : "Collect and leave"}
      </button>
    </div>
  );
};

export default CombatResolution;
