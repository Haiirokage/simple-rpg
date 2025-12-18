import { useResources } from "../data/resources/hooks";
import { useStructures } from "../data/structures/hooks";
import { useTime } from "../data/time/hooks";
import { getBerryIncomeMultiplier } from "../data/time/season-util";
import { useCallback, useMemo } from "preact/hooks";
import { getStorageCapacity } from "../data/resources/food-definitions";
import type { ResourceKeys } from "../data/resources/types";
import { objectKeys } from "../util";

const ResourceBox = () => {
  const { resources, data } = useResources();
  const { structures } = useStructures();
  const { day } = useTime();
  const berryIncomeMultiplier = useMemo(
    () => getBerryIncomeMultiplier(day),
    [day],
  );
  const dailyBerryIncome = Math.max(
    1,
    Math.round(structures.berryPlanter * berryIncomeMultiplier * 2),
  );

  const getCapacityDisplay = useCallback(
    (resourceKey: ResourceKeys): string => {
      const capacity = getStorageCapacity(resourceKey, structures.pantry);
      const capacityString = capacity === Infinity ? "?" : capacity.toString();
      return `${resources[resourceKey]}/${capacityString}`;
    },
    [resources, structures.pantry],
  );

  return (
    <ul style={{ fontFamily: "monospace" }}>
      {objectKeys(data).map((resource) => {
        const capacityDisplay = getCapacityDisplay(resource);
        return (
          <li key={resource}>
            <span style={{ display: "inline-block", width: "10em" }}>
              {resource}
            </span>
            {capacityDisplay}
            {resource === "berry" && structures.berryPlanter > 0 && (
              <span style={{ marginLeft: "0.5rem", opacity: 0.7 }}>
                (+{dailyBerryIncome})
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default ResourceBox;
