import { useResources } from "../../data/resources/hooks";
import { useStructures } from "../../data/structures/hooks";
import { useTime } from "../../data/time/hooks";
import { useCallback, useMemo } from "preact/hooks";
import type { ResourceKeys } from "../../data/resources/types";
import { objectKeys, objectEntries } from "../../util";
import { getStorageCapacity } from "../../data/resources/util";
import { FOOD_STORAGE } from "../../data/resources/food-definitions";
import { MATERIAL_WEIGHTS } from "../../data/craftComponents/definitions";
import type { CraftComponentType, MetalMaterial } from "../../data/craftComponents/types";
import { addComponents, getCraftComponentLabel } from "../../data/craftComponents/util";
import { useItems, useUpdateItemComponents } from "../../data/items/hooks";
import { useHandleExploration } from "../../data/exploration/hooks";
import { AccordionTopic } from "../../style/Accordion";
import { SmallButton } from "../../style/elements";
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
  const items = useItems();
  const updateItemComponents = useUpdateItemComponents();
  const { exploration, mutateExploration } = useHandleExploration();
  const berryIncome = useMemo(() => getBerryIncome(day), [day, getBerryIncome]);

  const pickUpComponent = (componentType: CraftComponentType, material: MetalMaterial) => {
    const delta = { [componentType]: { [material]: 1 } };
    updateItemComponents(delta, true);
    mutateExploration({ craftComponents: addComponents(exploration.craftComponents, delta) });
  };

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

  const storedComponents = objectEntries(items.craftComponents).flatMap(([componentType, entry]) =>
    (Object.keys(MATERIAL_WEIGHTS) as MetalMaterial[])
      .filter((material) => entry[material] > 0)
      .map((material) => ({ componentType, material, amount: entry[material] })),
  );

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
      {foodKeys.length > 0 && (
        <AccordionTopic label="Food">
          <ResourceList>{foodKeys.map(renderResource)}</ResourceList>
        </AccordionTopic>
      )}
      {materialKeys.length > 0 && (
        <AccordionTopic label="Materials">
          <ResourceList>{materialKeys.map(renderResource)}</ResourceList>
        </AccordionTopic>
      )}
      {structures.workshop > 0 && storedComponents.length > 0 && (
        <AccordionTopic label="Crafting components">
          <ResourceList>
            {storedComponents.map(({ componentType, material, amount }) => (
              <li key={`${componentType}-${material}`}>
                <span style={{ display: "inline-block", width: "10em" }}>
                  {getCraftComponentLabel(componentType, material)}
                </span>
                {`${amount} `}
                {!exploration.active && (
                  <SmallButton onClick={() => pickUpComponent(componentType, material)}>
                    Pick up
                  </SmallButton>
                )}
              </li>
            ))}
          </ResourceList>
        </AccordionTopic>
      )}
    </div>
  );
};

export default ResourceBox;
