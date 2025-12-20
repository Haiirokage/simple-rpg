import { useMutateResources, useResources } from "../../data/resources/hooks";
import { useTime, useUpdateTime } from "../../data/time/hooks";
import { useHomeUpgrades } from "../../data/homeUpgrades/hooks";
import { useCallback } from "preact/hooks";

const JERKY_RECIPE = {
  rabbitMeat: 5,
  wood: 10,
  output: 20, // jerky produced
  timeCost: 1, // 1 hour
} as const;

const FoodCrafting = () => {
  const { resources } = useResources();
  const { mutate } = useMutateResources();
  const { time } = useTime();
  const updateTime = useUpdateTime();
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
    updateTime({ time: time + JERKY_RECIPE.timeCost });
  }, [resources, mutate, time, updateTime]);

  return (
    <div className="food-crafting">
      {homeUpgrades.smoker && (
        <button onClick={makeJerky} disabled={!canMakeJerky()}>
          dry meat (5 rabbitMeat, 10 wood → 20 jerky)
        </button>
      )}
    </div>
  );
};

export default FoodCrafting;
