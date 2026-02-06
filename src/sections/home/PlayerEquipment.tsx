import { useHandleEquipment } from "../../data/equipment/hooks";
import { TOOL_DEFINITIONS } from "../../data/equipment/definitions";
import { objectEntries } from "../../util";
import TooltipWrapper from "../../style/TooltipWrapper";

const PlayerEquipment = () => {
  const { equipment, getEquipmentBonus } = useHandleEquipment();
  const { tools, consumables } = equipment;

  return (
    <div>
      <h3>Equipment</h3>
      <ul style={{ fontFamily: "monospace" }}>
        {objectEntries(TOOL_DEFINITIONS).map(([toolKey, toolDef]) => {
          const toolStatus = tools[toolKey];
          if (!toolStatus) {
            return null;
          }
          const { tier, level } = toolStatus;
          const tierName = toolDef.tiers[tier].name;
          const bowDesc = toolKey === "bow" ? `Range: ${getEquipmentBonus("bow", "range")}` : "";
          return (
            <TooltipWrapper description={bowDesc}>
              <li key={toolKey}>
                <span style={{ display: "inline-block", width: "6em" }}>{toolDef.name}</span>
                {tierName} lvl {level}
              </li>
            </TooltipWrapper>
          );
        })}
        {consumables.trap && (
          <li>
            <span style={{ display: "inline-block", width: "6em" }}>Traps</span>
            {consumables.trap.current}/{consumables.trap.max}
          </li>
        )}
        {consumables.lantern && (
          <li>
            <span style={{ display: "inline-block", width: "6em" }}>Lantern</span>
            {consumables.lantern.current}
          </li>
        )}
      </ul>
    </div>
  );
};

export default PlayerEquipment;
