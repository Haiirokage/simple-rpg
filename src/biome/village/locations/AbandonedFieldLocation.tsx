import { useEffect, useState } from "preact/hooks";
import { useHandleExploration } from "../../../data/exploration/hooks";
import { useTime } from "../../../data/time/hooks";
import { isDay } from "../../../data/time/season-util";
import { useGetOrCreateNPC, useHandleNPCs, useNPCsAtLocation } from "../../../npc/npc-hooks";
import NPCInteractionView from "../../../sections/exploration/NPCInteractionView";

const BLACKSMITH_VOUCH_TRUST_REQ = 10;
const BLACKSMITH_VOUCH_TRUST_CAP = 5;

const AbandonedFieldLocation = () => {
  const { mutateExploration } = useHandleExploration();
  const getOrCreate = useGetOrCreateNPC();
  const { npcs, grantTrust } = useHandleNPCs();
  const { time, day } = useTime();
  const isNight = !isDay(time, day);
  const [talkingToId, setTalkingToId] = useState<string | undefined>();
  const [message, setMessage] = useState<string | undefined>();

  useEffect(() => {
    getOrCreate("village_miller", "miller");
  });

  const presentNPCs = useNPCsAtLocation("village", "abandoned_field");
  const miller = presentNPCs.find((npc) => npc.type === "miller");
  const blacksmith = npcs["village_blacksmith"];
  const canVouchForMiller =
    miller !== undefined &&
    miller.trust < BLACKSMITH_VOUCH_TRUST_CAP &&
    (blacksmith?.trust ?? 0) >= BLACKSMITH_VOUCH_TRUST_REQ;

  const talkingTo = presentNPCs.find((npc) => npc.id === talkingToId);
  if (talkingTo) {
    return <NPCInteractionView npc={talkingTo} onLeave={() => setTalkingToId(undefined)} />;
  }

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
        {message && (
          <p>
            <em>{message}</em>
          </p>
        )}
        {canVouchForMiller && (
          <button
            onClick={() => {
              grantTrust(miller!.id, BLACKSMITH_VOUCH_TRUST_CAP, BLACKSMITH_VOUCH_TRUST_CAP);
              setMessage(
                "The blacksmith talks positively of you, if you need some pointers, I can help you train.",
              );
            }}
            style={{ marginRight: "0.5rem" }}
          >
            The miller beckons you over.
          </button>
        )}
        {presentNPCs.map((npc) => (
          <button key={npc.id} onClick={() => setTalkingToId(npc.id)}>
            {`Talk to ${npc.name}`}
          </button>
        ))}
        <button onClick={handleLeave}>Leave</button>
      </div>
    </div>
  );
};

export default AbandonedFieldLocation;
