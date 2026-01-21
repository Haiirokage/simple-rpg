import FoodCrafting from "../../components/actions/FoodCrafting";
import ConsumableCrafting from "../../components/actions/ConsumableCrafting";
import ToolCrafting from "../../components/actions/ToolCrafting";
import ResourceEnrichment from "../../components/actions/ResourceEnrichment";

export default function PlayerActions() {
  return (
    <div>
      <section>
        <FoodCrafting />
        <ConsumableCrafting />
        <ResourceEnrichment />
        <ToolCrafting />
      </section>
    </div>
  );
}
