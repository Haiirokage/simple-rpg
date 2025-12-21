import { useResources } from "../data/resources/hooks";
import { useStructures } from "../data/structures/hooks";
import { useTime } from "../data/time/hooks";
import { useCallback, useMemo } from "preact/hooks";
import type { ResourceKeys } from "../data/resources/types";
import { objectKeys } from "../util";
import { getStorageCapacity } from "../data/resources/util";

const ResourceBox = () => {
  const { resources, data } = useResources();
  const { structures, getBerryIncome } = useStructures();
  const { day } = useTime();
  const berryIncome = useMemo(() => getBerryIncome(day), [day, getBerryIncome]);

  const getCapacityDisplay = useCallback(
    (resourceKey: ResourceKeys): string => {
      const capacity = getStorageCapacity(resourceKey, structures);
      const capacityString = capacity === Infinity ? "?" : capacity.toString();
      return `${resources[resourceKey]}/${capacityString}`;
    },
    [resources, structures],
  );

  return (
    <ul style={{ fontFamily: "monospace" }}>
      {objectKeys(data).map((resource) => {
        const capacityDisplay = getCapacityDisplay(resource);
        return (
          <li key={resource}>
            <span style={{ display: "inline-block", width: "10em" }}>{resource}</span>
            {capacityDisplay}
            {resource === "berry" && structures.berryPlanter > 0 && (
              <span style={{ marginLeft: "0.5rem", opacity: 0.7 }}>(+{berryIncome})</span>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default ResourceBox;
