import FoodCrafting from "../../components/actions/FoodCrafting";
import ConsumableCrafting from "../../components/actions/ConsumableCrafting";
import ToolCrafting from "../../components/actions/ToolCrafting";

export default function PlayerActions() {
  return (
    <div>
      <section>
        <FoodCrafting />
        <ConsumableCrafting />
        <ToolCrafting />
      </section>
    </div>
  );
}
