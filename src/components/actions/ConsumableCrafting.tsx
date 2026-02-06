import { useResources, useMutateResources } from "../../data/resources/hooks";
import { getAffordability, hasDiscoveredResources } from "../../data/resources/util";
import { useEquipment, useUpdateEquipment } from "../../data/equipment/hooks";
import { useAdvanceTime } from "../../data/time/hooks";
import { EQUIPMENT_DEFINITIONS } from "../../data/equipment/definitions";
import { useDiscoveries } from "../../data/discoveries/hooks";
import type { ResourceStore } from "../../data/resources/types";
import { objectEntries } from "../../util";
import type { ConsumableType } from "../../data/equipment/types";

const ConsumableCrafting = () => {
  const { resources, data } = useResources();
  const { mutate: mutateResources } = useMutateResources();
  const { consumables } = useEquipment();
  const { mutateSpecific } = useUpdateEquipment();
  const advanceTime = useAdvanceTime();
  const discoveries = useDiscoveries();

  const craftConsumables = (key: ConsumableType, resourceResult: Partial<ResourceStore>) => {
    const equipmentData = consumables[key];

    // Subtract costs from resources
    mutateResources(resourceResult);

    // Increment both max and current (new trap is immediately available)
    const currentMax = equipmentData?.max ?? 0;
    const currentCount = equipmentData?.current ?? 0;
    const updatedData = { max: currentMax + 1, current: currentCount + 1 };

    mutateSpecific("consumables", {
      [key]: updatedData,
    });
    advanceTime(1);
  };

  return (
    <div className="consumable-crafting">
      {EQUIPMENT_DEFINITIONS.map((definition) => {
        const equipmentData = consumables[definition.key];
        const count = equipmentData?.max ?? 0;
        const { canAfford, resourceResult } = getAffordability(definition.cost, resources);
        const canCraft = canAfford && count < definition.maxCount;
        const hasDiscovered = hasDiscoveredResources(definition.cost, data);

        // Trap requires rabbit_trail discovery
        if (definition.key === "trap" && discoveries.rabbit_trail === 0) {
          return null;
        }

        // Don't show this crafting option until resources are discovered
        if (!hasDiscovered) {
          return null;
        }

        const costText = objectEntries(definition.cost)
          .map(([key, cost]) => `${cost} ${key}`)
          .join(", ");

        return (
          <div key={definition.key}>
            <button
              disabled={!canCraft}
              onClick={() => craftConsumables(definition.key, resourceResult)}
            >
              Craft {definition.name} ({costText})
            </button>
            {count >= definition.maxCount && (
              <div style={{ fontSize: "0.85em", opacity: 0.7 }}>
                Max {definition.name.toLowerCase()} reached
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ConsumableCrafting;
