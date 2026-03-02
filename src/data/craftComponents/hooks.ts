import { useHandleExploration } from "../exploration/hooks";
import { objectEntries } from "../../util";
import { addComponents, getCraftComponentLabel } from "./util";
import type { ComponentCost, CraftComponentType } from "./types";

export const useComponentCost = () => {
  const { exploration, mutateExploration } = useHandleExploration();

  const canAffordComponents = (componentCost: ComponentCost) =>
    objectEntries(componentCost).every(
      ([type, materialCost]) =>
        !materialCost ||
        objectEntries(materialCost).every(
          ([material, needed]) =>
            exploration.craftComponents[type as CraftComponentType][material] >= (needed ?? 0),
        ),
    );

  const deductComponents = (componentCost: ComponentCost) => {
    if (!objectEntries(componentCost).length) return;
    mutateExploration({
      craftComponents: addComponents(exploration.craftComponents, componentCost, true),
    });
  };

  return { canAffordComponents, deductComponents };
};

export const formatComponentCost = (componentCost: ComponentCost): string =>
  objectEntries(componentCost)
    .flatMap(([type, materialCost]) =>
      materialCost
        ? objectEntries(materialCost).map(
            ([mat, n]) => `${n} ${getCraftComponentLabel(type as CraftComponentType, String(mat))}`,
          )
        : [],
    )
    .join(", ");
