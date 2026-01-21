import { useEquipment } from "../../data/equipment/hooks";
import { TOOL_DEFINITIONS } from "../../data/equipment/definitions";
import { objectEntries } from "../../util";

const PlayerEquipment = () => {
  const { consumables, tools } = useEquipment();

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
          return (
            <li key={toolKey}>
              <span style={{ display: "inline-block", width: "6em" }}>{toolDef.name}</span>
              {tierName} lvl {level}
            </li>
          );
        })}
        {consumables.trap.count === 0 ? null : (
          <li>
            <span style={{ display: "inline-block", width: "6em" }}>Traps</span>
            {consumables.trap.active}/{consumables.trap.count}
          </li>
        )}
      </ul>
    </div>
  );
};

export default PlayerEquipment;
