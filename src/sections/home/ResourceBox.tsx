import { useResources } from "../../data/resources/hooks";
import { useStructures } from "../../data/structures/hooks";
import { useTime } from "../../data/time/hooks";
import { useCallback, useMemo } from "preact/hooks";
import type { ResourceKeys } from "../../data/resources/types";
import { objectKeys } from "../../util";
import { getStorageCapacity } from "../../data/resources/util";
import { FOOD_STORAGE } from "../../data/resources/food-definitions";
import styled from "styled-components";

const ResourceList = styled.ul`
  list-style: none;
  padding-left: 0;
`;

const FOOD_KEYS = new Set<ResourceKeys>(FOOD_STORAGE.map((f) => f.key));

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

  const discovered = objectKeys(data);
  const foodKeys = discovered.filter((k) => FOOD_KEYS.has(k));
  const materialKeys = discovered.filter((k) => !FOOD_KEYS.has(k) && k !== "coin");

  const renderResource = (resource: ResourceKeys) => {
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
  };

  return (
    <div style={{ fontFamily: "monospace" }}>
      {foodKeys.length > 0 && <ResourceList>{foodKeys.map(renderResource)}</ResourceList>}
      {materialKeys.length > 0 && <ResourceList>{materialKeys.map(renderResource)}</ResourceList>}
    </div>
  );
};

export default ResourceBox;
