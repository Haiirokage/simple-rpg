import { useMutateResources, useResources } from "../../data/resources/hooks";
import { useAdvanceTime } from "../../data/time/hooks";
import { useHomeUpgrades } from "../../data/homeUpgrades/hooks";
import { Button } from "../../style/elements";

const JERKY_RECIPE = {
  meatCost: 5,
  wood: 10,
  output: 20,
  timeCost: 1,
} as const;

const MEAT_TYPES = ["rabbitMeat", "venison"] as const;
type MeatType = (typeof MEAT_TYPES)[number];

const FoodCrafting = () => {
  const { resources, data } = useResources();
  const { mutate } = useMutateResources();
  const advanceTime = useAdvanceTime();
  const { data: homeUpgrades } = useHomeUpgrades();

  const makeJerky = (meat: MeatType) => {
    mutate({
      [meat]: resources[meat] - JERKY_RECIPE.meatCost,
      wood: resources.wood - JERKY_RECIPE.wood,
      jerky: resources.jerky + JERKY_RECIPE.output,
    });
    advanceTime(JERKY_RECIPE.timeCost);
  };

  return (
    <div>
      {homeUpgrades.smoker &&
        MEAT_TYPES.map((meat) => {
          const canMake =
            resources[meat] >= JERKY_RECIPE.meatCost && resources.wood >= JERKY_RECIPE.wood;

          if (!(meat in data)) return null;
          return (
            <Button key={meat} onClick={() => makeJerky(meat)} disabled={!canMake}>
              Dry {meat} (5 {meat}, 10 wood → 20 jerky)
            </Button>
          );
        })}
    </div>
  );
};

export default FoodCrafting;
