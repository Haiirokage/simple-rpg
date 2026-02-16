import type { EncounterFrame } from "../../data/encounters/types";

export type ForestEncounterFrameId =
  | "deer_tracks_found"
  | "edable_roots"
  | "wolf_encounter"
  | "npc_encounter";

export const FOREST_ENCOUNTERS: Record<ForestEncounterFrameId, EncounterFrame> = {
  deer_tracks_found: {
    id: "deer_tracks_found",
    title: "Fresh Deer Tracks",
    description: "You've discovered fresh deer tracks in the soft earth. The prints are recent.",
    actions: [
      {
        type: "skill",
        label: "Try to track the deer",
        cost: { minutes: 30 },
        skillCheck: {
          knowledge: true,
          skill: ["hunter"],
          dc: 6,
        },
        outcomes: {
          failure: {
            nextFrameId: "exit",
            exitMessage: "You lost the tracks and spent some time finding your way back.",
          },
          success: {
            nextFrameId: "combat",
            spawnCreatures: [{ type: "deer", id: "deer1", distance: 100 }],
            combatConfig: {
              flavorText: "After careful tracking, you spot a deer grazing some distance away.",
              exitMessage: "The deer escaped into the forest, never to be seen again.",
              onKill: { discovery: "successful_hunt" },
            },
          },
        },
      },
    ],
  },
  edable_roots: {
    id: "edable_roots",
    title: "Mystery roots",
    description:
      "You find some roots that look like they could be a source of food. Do you check if they are edible?",
    actions: [
      {
        type: "skill",
        label: "Taste the root",
        skillCheck: { knowledge: true, dc: 5, skill: [] },
        cost: { minutes: 60 },
        outcomes: {
          failure: {
            nextFrameId: "exit",
            exitMessage:
              "You ate a poisonous plant, and lost your dinner. You should be more careful.",
            sideEffect: "nausea",
          },
          success: {
            nextFrameId: "exit",
            exitMessage: "These tubers are good and seems nutritious, I should gather some",
            resourceYield: { tuber: 5 },
            discovery: "find_tubers",
          },
        },
      },
    ],
  },
  wolf_encounter: {
    id: "wolf_encounter",
    title: "A Lone Wolf",
    preventLeaving: true,
    description:
      "A gaunt wolf stands between the trees, watching you with wary eyes. Its ribs are showing — it must be desperate to approach a human.",
    actions: [
      {
        type: "skill",
        label: "Stand your ground",
        cost: { minutes: 10 },
        skillCheck: {
          knowledge: true,
          skill: ["stealth", "hunter"],
          dc: 9,
        },
        outcomes: {
          failure: {
            nextFrameId: "combat",
            spawnCreatures: [
              { type: "wolf", id: "wolf1", distance: 30, hostile: true, discovered: true },
            ],
            combatConfig: {
              flavorText: "The wolf snarls and lunges forward. It's not backing down.",
            },
          },
          success: {
            nextFrameId: "exit",
            exitMessage:
              "You hold your ground, making yourself look large. The wolf hesitates, then slinks away into the undergrowth.",
          },
        },
      },
      {
        type: "skill",
        label: "Try to catch it unaware",
        cost: { minutes: 15 },
        skillCheck: {
          knowledge: true,
          skill: ["stealth"],
          dc: 7,
        },
        outcomes: {
          failure: {
            nextFrameId: "combat",
            spawnCreatures: [
              { type: "wolf", id: "wolf1", distance: 40, hostile: true, discovered: true },
            ],
            combatConfig: {
              flavorText: "The wolf spots your movement and bares its teeth.",
            },
          },
          success: {
            nextFrameId: "combat",
            spawnCreatures: [{ type: "wolf", id: "wolf1", distance: 40, hostile: true }],
            combatConfig: {
              flavorText:
                "You manage to ready your bow without the wolf noticing. It's still watching the treeline.",
            },
          },
        },
      },
    ],
  },
  npc_encounter: {
    id: "npc_encounter",
    title: "A Familiar Face",
    description:
      "You discover a young woman kneeling in the bushes near a patch of berries. She looks up, startled but not afraid. She says she's from a village not far from here.",
    npc: { type: "barmaid", id: "village_barmaid" },
    actions: [],
  },
};
