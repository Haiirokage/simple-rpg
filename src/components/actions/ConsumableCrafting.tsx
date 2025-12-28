import { useResources, useMutateResources } from "../../data/resources/hooks";
import { getAffordability, hasDiscoveredResources } from "../../data/resources/util";
import { useEquipment, useUpdateEquipment } from "../../data/equipment/hooks";
import { useAdvanceTime } from "../../data/time/hooks";
import { EQUIPMENT_DEFINITIONS } from "../../data/equipment/definitions";
import type { ResourceStore } from "../../data/resources/types";
import { objectEntries } from "../../util";
import type { ConsumableType } from "../../data/equipment/types";

const ConsumableCrafting = () => {
  const { resources, data } = useResources();
  const { mutate: mutateResources } = useMutateResources();
  const { consumables } = useEquipment();
  const { mutateSpecific } = useUpdateEquipment();
  const advanceTime = useAdvanceTime();

  const craftConsumables = (key: ConsumableType, resourceResult: Partial<ResourceStore>) => {
    const equipmentData = consumables[key];

    // Subtract costs from resources
    mutateResources(resourceResult);

    // Increment equipment count
    const updatedData = { ...equipmentData, count: equipmentData.count + 1 };

    mutateSpecific("consumables", {
      [key]: updatedData,
    });
    advanceTime(1);
  };

  return (
    <div className="consumable-crafting">
      {EQUIPMENT_DEFINITIONS.map((definition) => {
        const { count } = consumables[definition.key];
        const { canAfford, resourceResult } = getAffordability(definition.cost, resources);
        const canCraft = canAfford && count < definition.maxCount;
        const hasDiscovered = hasDiscoveredResources(definition.cost, data);

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
