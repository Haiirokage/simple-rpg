import type { EncounterFrame } from "../../data/encounters/types";

export type VillageEncounterFrameId = "repair_job_offer";

export const VILLAGE_ENCOUNTERS: Record<VillageEncounterFrameId, EncounterFrame> = {
  repair_job_offer: {
    id: "repair_job_offer",
    title: "A Fence in Need",
    description:
      "An older farmer waves you down near a stretch of broken fencing. Several posts have rotted through and the crossbeams hang at odd angles. He offers a few coins if you can help him set it right.",
    actions: [
      {
        type: "skill",
        id: "help_repair",
        label: "Help with the repairs",
        cost: { minutes: 60, energy: 8 },
        skillCheck: {
          skill: ["crafting"],
          dc: 5,
        },
        outcomes: {
          success: {
            nextFrameId: "exit",
            exitMessage:
              "Working together, you manage to replace the worst posts and secure the beams. The farmer thanks you warmly and presses a few coins into your hand.",
            resourceYield: { coin: 8 },
          },
          failure: {
            nextFrameId: "exit",
            exitMessage:
              "Despite your best efforts, the repair proves trickier than expected. A beam splits when you try to nail it in place. The farmer sighs but thanks you for trying.",
          },
        },
      },
    ],
  },
};
