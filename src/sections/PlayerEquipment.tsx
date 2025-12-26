import { useEquipment } from "../data/equipment/hooks";
import { TOOL_DEFINITIONS } from "../data/equipment/definitions";

const PlayerEquipment = () => {
  const { consumables, tools } = useEquipment();

  return (
    <div>
      <h3>Equipment</h3>
      <ul style={{ fontFamily: "monospace" }}>
        {TOOL_DEFINITIONS.map((toolDef) => {
          const toolStatus = tools[toolDef.key];
          const tierName = toolDef.tiers[toolStatus.level].name;
          return tierName === "none" ? null : (
            <li key={toolDef.key}>
              <span style={{ display: "inline-block", width: "6em" }}>{toolDef.name}</span>
              {tierName}
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
