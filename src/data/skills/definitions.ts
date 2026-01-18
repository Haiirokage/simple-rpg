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
  }
};
