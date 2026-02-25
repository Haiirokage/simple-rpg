import type { Attributes } from "../attributes/types";
import type { Skills } from "./types";

export const getAttributeBySkill = (skill: Skills): Attributes => {
  switch (skill) {
    case "hunter":
      return "dexterity";
    case "ranged":
      return "dexterity";
    case "crafting":
      return "wisdom";
    case "stealth":
      return "dexterity";
    case "meditation":
      return "wisdom";
    case "lore":
      return "intelligence";
    case "mining":
      return "strength";
    case "smithing":
      return "wisdom";
  }
};
