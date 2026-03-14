import { useEffect } from "preact/hooks";
import { useHandleExploration } from "../../../data/exploration/hooks";
import { useTime } from "../../../data/time/hooks";
import { isDay } from "../../../data/time/season-util";
import { useGetOrCreateNPC, useNPCsAtLocation } from "../../../npc/npc-hooks";

const AbandonedFieldLocation = () => {
  const { mutateExploration } = useHandleExploration();
  const getOrCreate = useGetOrCreateNPC();
  const { time, day } = useTime();
  const isNight = !isDay(time, day);

  useEffect(() => {
    getOrCreate("village_miller", "miller");
  });

  const presentNPCs = useNPCsAtLocation("village", "abandoned_field");
  console.log(presentNPCs);

  const handleLeave = () => {
    mutateExploration({ location: undefined });
  };

  return (
    <div>
      <h2>{"The Abandoned Field"}</h2>
      <p>
        {isNight
          ? "Torchlight flickers at the edge of the field. A handful of figures work through drills and take turns sparring, the crack of quarterstaffs carrying clearly in the still night air."
          : "In daylight the field looks unremarkable — trampled grass, a rough circle of stones in one corner, and a few staves leaning against the fence post. Nobody's here yet."}
      </p>
      <div style={{ marginTop: "1rem" }}>
        <button onClick={handleLeave}>Leave</button>
      </div>
    </div>
  );
};

export default AbandonedFieldLocation;
