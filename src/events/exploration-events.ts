import type { AllDiscoveries } from "../biome/discovery-types";
import type { EventLogEntry } from "../data/eventLog/types";
import type { ExplorationEvent } from "./types";

/**
 * Exploration events are logged during exploration activities.
 * These record discoveries, findings, and exploration outcomes.
 */
export const EXPLORATION_EVENTS: Partial<Record<AllDiscoveries, ExplorationEvent>> = {
  berry_patch: {
    id: "berry_patch",
    name: "Found Berry Patch",
    category: "exploration",
    descriptions: [
      "You stumble upon a dense thicket laden with ripe berries. The sweet scent fills the air as you carefully pluck the clusters from thorny branches. These berries will be vital to your survival—a reliable source of food to forage throughout the seasons.",
      "A sun-dappled clearing opens before you, its edges lined with berry bushes heavy with fruit. The clearing seems to be a crossroads of animal trails, suggesting this is a well-known feeding ground for the forest's inhabitants. You fill your pockets before moving on.",
      "Behind a curtain of hanging vines, you discover bushes laden with plump berries in various stages of ripeness. You could pick them now or return when they're perfectly ripe. Either way, this find is a stroke of luck.",
      "The forest opens into a small depression where berry bushes dominate the understory. The abundance suggests ideal growing conditions—the soil here must be particularly rich. You mark this location mentally for future visits.",
      "Pushing through dense underbrush, you emerge into a hidden glade bursting with berry bushes. The sight takes your breath away—more berries than you've ever seen in one place. You could gather here for weeks without depleting the supply.",
    ],
  },
  willow_grove: {
    id: "willow_grove",
    name: "Found Willow Grove",
    category: "exploration",
    descriptions: [
      "Your boots squelch as you approach a boggy depression where several willow trees have taken root near a slow-moving stream. The bark is remarkably supple—perfect for crafting fiber. You realize you've found a valuable material source that could provide numerous crafting materials.",
      "A cluster of graceful willow trees emerges from the forest, their long drooping branches creating a natural shelter. The bark beneath your fingers feels strong yet flexible. You make a mental note of this hidden grove for future visits.",
      "Near a small pond, willow trees lean over the water as if admiring their reflection. The abundance of branches suggests you could harvest from here without harming the grove. A serene place, and a practical one too.",
    ],
  },
  rabbit_trail: {
    id: "rabbit_trail",
    name: "Discovered Rabbit Trail",
    category: "exploration",
    descriptions: [
      "Parting a curtain of brambles, you find yourself at the entrance to a sprawling rabbit warren. Countless burrow entrances honeycomb the bank, and the air carries the distinct musky scent of rabbits. A realization strikes you—with materials and effort, you could fashion traps to catch these creatures. This discovery opens new possibilities for sustenance.",
      "You discover a worn trail through the undergrowth, marked by fresh droppings and nibbled vegetation. The beaten path suggests a well-established rabbit warren nearby. You could potentially use this knowledge to your advantage.",
      "Beneath an overhanging root system, you find a network of rabbit tunnels. The paths are clearly well-traveled, suggesting a healthy population living nearby. You could set snares here when you're ready.",
      "A sudden movement in the grass catches your eye—rabbits! They bolt toward a cluster of burrows, leaving clear trails in their wake. You study the warren carefully, noting its location and size.",
    ],
  },
  deer_tracks: {
    id: "deer_tracks",
    name: "Found Deer Tracks",
    category: "exploration",
    descriptions: [
      "Near a shallow creek, you discover a perfect impression of a deer's bed pressed into the tall grass—still warm to the touch. Nearby, a few strands of reddish-brown fur cling to low branches. The deer couldn't have left more than an hour ago, and you feel a thrill at how close you've come to witnessing the forest's larger inhabitants.",
      "Fresh hoof prints press into the soft earth of a forest path, their size and depth suggesting a mature deer passed through here recently. You follow the trail of broken twigs and disturbed moss, wondering where these graceful creatures make their home.",
    ],
  },
  strong_inspiration: {
    id: "strong_inspiration",
    name: "Discovered Strength Conditioning",
    category: "exploration",
    descriptions: [
      "While gathering stones, you spot several perfectly-weighted rocks—smooth, heavy, and balanced. As you load them into your pack, your muscles ache with a pleasant burn. It strikes you that carrying these stones around is actually strengthening your body. Perhaps there's a way to harness this feeling, to deliberately train with weights and build real strength for the challenges ahead.",
      "You find a cache of excellently-formed stones nestled in a rocky outcrop. Their substantial weight makes your arms and shoulders work as you collect them. The good ache that follows stays with you for hours, a satisfying reminder of effort turned to strength. You wonder if you could recreate that feeling intentionally, building yourself stronger for the winter ahead.",
    ],
  },
  mysterious_roots: {
    id: "mysterious_roots",
    name: "Edable tubers?",
    category: "exploration",
    descriptions: [""],
  },
  wolf_sighting: {
    id: "wolf_sighting",
    name: "Wolf Spotted",
    category: "exploration",
    descriptions: [
      "A flash of grey between the trees catches your eye. A lone wolf watches you from a distance, its yellow eyes gleaming with a mix of hunger and caution.",
    ],
  },
  foraging_npc: {
    id: "foraging_npc",
    name: "Forager Encountered",
    category: "exploration",
    descriptions: [
      "You spot someone crouching near a berry bush ahead. As you approach, a young woman looks up with a cautious smile. She seems to know these woods well enough.",
    ],
  },
  large_lake: {
    id: "large_lake",
    name: "A Large lake",
    category: "exploration",
    descriptions: ["This large body of water could be useful"],
  },
  repair_job: {
    id: "repair_job",
    name: "Work Opportunity",
    category: "exploration",
    descriptions: [
      "A farmer calls out to you, gesturing toward a section of broken fencing. Looks like he could use an extra pair of hands.",
    ],
  },
};

export const buildExplorationEventLog = (
  discoveryType: AllDiscoveries,
  year: number,
  day: number,
  descriptionIndex?: number,
): EventLogEntry => {
  const event = EXPLORATION_EVENTS[discoveryType];
  const randomIndex =
    event && event.descriptions.length > 0
      ? Math.floor(Math.random() * event.descriptions.length)
      : undefined;

  return {
    eventId: event?.id ?? discoveryType,
    category: "exploration",
    year,
    day,
    descriptionIndex: descriptionIndex || randomIndex,
  };
};
