import type { EncounterFrame } from "./types";

export const ENCOUNTER_FRAMES: Record<string, EncounterFrame> = {
  deer_tracks_found: {
    id: "deer_tracks_found",
    title: "Fresh Deer Tracks",
    description: "You've discovered fresh deer tracks in the soft earth. The prints are recent.",
    actions: [
      {
        id: "track_deer",
        label: "Try to track the deer",
        cost: { minutes: 30 },
        skillCheck: {
          knowledge: ["forest"],
          attribute: [],
          skill: ["hunter"],
          dc: 12,
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
    actions: [],
  },
  deer_killed: {
    id: "deer_killed",
    title: "Deer Killed",
    description:
      "Your shot finds its mark. The deer is down. You approach and see valuable materials you could gather.",
    actions: [],
  },
};
