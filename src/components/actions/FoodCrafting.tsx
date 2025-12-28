import { useMutateResources, useResources } from "../../data/resources/hooks";
import { useAdvanceTime } from "../../data/time/hooks";
import { useHomeUpgrades } from "../../data/homeUpgrades/hooks";
import { useCallback } from "preact/hooks";
import { Button } from "../../style/elements";

const JERKY_RECIPE = {
  rabbitMeat: 5,
  wood: 10,
  output: 20, // jerky produced
  timeCost: 1, // 1 hour
} as const;

const FoodCrafting = () => {
  const { resources } = useResources();
  const { mutate } = useMutateResources();
  const advanceTime = useAdvanceTime();
  const { data: homeUpgrades } = useHomeUpgrades();

  const canMakeJerky = useCallback(() => {
    return resources.rabbitMeat >= JERKY_RECIPE.rabbitMeat && resources.wood >= JERKY_RECIPE.wood;
  }, [resources.rabbitMeat, resources.wood]);

  const makeJerky = useCallback(() => {
    mutate({
      rabbitMeat: resources.rabbitMeat - JERKY_RECIPE.rabbitMeat,
      wood: resources.wood - JERKY_RECIPE.wood,
      jerky: resources.jerky + JERKY_RECIPE.output,
    });
    advanceTime(JERKY_RECIPE.timeCost);
  }, [resources, mutate, advanceTime]);

  return (
    <div className="food-crafting">
      {homeUpgrades.smoker && (
        <Button onClick={makeJerky} disabled={!canMakeJerky()}>
          Dry meat (5 rabbitMeat, 10 wood → 20 jerky)
        </Button>
      )}
    </div>
  );
};

export default FoodCrafting;
