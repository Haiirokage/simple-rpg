import { useEquipment } from "../data/equipment/hooks";

const PlayerEquipment = () => {
  const { consumables, tools } = useEquipment();

  return (
    <div>
      <h3>Equipment</h3>
      <ul style={{ fontFamily: "monospace" }}>
        <li>
          <span style={{ display: "inline-block", width: "6em" }}>Hatchet</span>
          {tools.hatchet.level}
        </li>
        <li>
          <span style={{ display: "inline-block", width: "6em" }}>Traps</span>
          {consumables.trap.active}/{consumables.trap.count}
        </li>
      </ul>
    </div>
  );
};

export default PlayerEquipment;
