import type {
  CostType,
  EncounterFrameId,
  EncounterOutcomes,
  FrameOutcome,
  SkillAction,
  SkillCheck,
} from "../data/encounters/types";
import type { ResourceStore } from "../data/resources/types";
import type { AllUnlockables } from "./discovery-types";

export const makeEncounterSkillAction = (
  label: string,
  skillCheck: SkillCheck,
  outcomes: EncounterOutcomes,
  opts: {
    cost?: CostType;
    discoveryRequirement?: { id: AllUnlockables; progress?: number };
  } = {},
): SkillAction => {
  return {
    type: "skill",
    label,
    cost: { minutes: 30, energy: 5, ...opts.cost },
    skillCheck,
    outcomes,
    discoveryRequirement: opts.discoveryRequirement,
  };
};

export const makeOutcome = (
  exitMessage: string,
  opts: {
    resourceYield?: Partial<ResourceStore>;
    nextFrameId?: EncounterFrameId;
    discovery?: AllUnlockables;
  } = {},
): FrameOutcome => {
  return {
    nextFrameId: opts.nextFrameId || "exit",
    exitMessage,
    resourceYield: opts.resourceYield,
    discovery: opts.discovery,
  };
};
