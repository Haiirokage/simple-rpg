import { useHandleEquipment } from "../../data/equipment/hooks";
import { TOOL_DEFINITIONS } from "../../data/equipment/definitions";
import { objectEntries } from "../../util";
import TooltipWrapper from "../../style/TooltipWrapper";

const PlayerEquipment = () => {
  const { equipment, getTool } = useHandleEquipment();
  const { consumables } = equipment;

  return (
    <div>
      <h3>Equipment</h3>
      <ul style={{ fontFamily: "monospace" }}>
        {objectEntries(TOOL_DEFINITIONS).map(([toolKey, toolDef]) => {
          const { bonuses, toolStatus } = getTool(toolKey);
          const { tier, level } = toolStatus;
          if (tier === 0) {
            return null;
          }
          const tierName = toolDef.tiers[tier].name;
          const bonusDesc = objectEntries(bonuses)
            .filter(([_, value]) => value !== 1)
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ");
          return (
            <TooltipWrapper description={bonusDesc}>
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
