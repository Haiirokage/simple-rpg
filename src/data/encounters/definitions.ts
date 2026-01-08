import type { EncounterFrame } from "./types";

export const ENCOUNTER_FRAMES: Record<string, EncounterFrame> = {
  deer_tracks_found: {
    id: "deer_tracks_found",
    title: "Fresh Deer Tracks",
    description: "You've discovered fresh deer tracks in the soft earth. The prints are recent.",
    actions: [
      {
        type: "skill",
        id: "track_deer",
        label: "Try to track the deer",
        cost: { minutes: 30 },
        skillCheck: {
          knowledge: true,
          skill: ["hunter"],
          dc: 14,
        },
        outcomes: {
          failure: { nextFrameId: "exit" },
          success: { nextFrameId: "deer_spotted" },
        },
      },
    ],
  },
  deer_spotted: {
    id: "deer_spotted",
    title: "Deer Spotted",
    description:
      "After careful tracking, you spot the deer grazing some distance away. It hasn't noticed you yet.",
    spawnCreatures: [{ type: "deer", id: "deer1", distance: 100 }],
    actions: [
      {
        type: "attack",
        id: "shoot deer",
        label: "Take a shot at the deer",
        cost: {},
        attack: {
          weaponType: "ranged",
          target: "deer1",
        },
        outcomes: {
          failure: { nextFrameId: "exit" },
          success: { nextFrameId: "deer_killed" },
        },
      },
    ],
  },
  deer_killed: {
    id: "deer_killed",
    title: "Deer Killed",
    description:
      "Your shot finds its mark. The deer is down. You approach and see valuable materials you could gather.",
    actions: [
      {
        type: "skill",
        id: "butcher_deer",
        label: "Butcher the deer",
        cost: { minutes: 60, energy: 5 },
        skillCheck: { skill: ["hunter"], knowledge: true, dc: 15 },
        outcomes: {
          failure: { nextFrameId: "exit", resourceYield: { venison: 15 } },
          success: { nextFrameId: "exit", resourceYield: { venison: 20 } },
        },
      },
    ],
  },
};
