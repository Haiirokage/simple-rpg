import type { SmithingKnowledgeMap } from "../../../data/smithing/types";

type SmithingText = {
  [T in keyof SmithingKnowledgeMap]: {
    label: string;
    entries: {
      [K in keyof SmithingKnowledgeMap[T]]: string;
    };
  };
};

export const BLACKSMITH_TEXT: SmithingText = {
  copper: {
    label: "Copper",
    entries: {
      ore: "\"You'll find copper ore in the rocky outcroppings out east. Look for the green staining on the rock. I'll buy whatever you bring me.\"",
    },
  },
  smelting: {
    label: "Smelting",
    entries: {
      basics:
        "\"Smelting's not complicated, but you need the heat right. Charcoal burns hotter than wood, you'll need a proper furnace and patience. It will take time and skill to get the proper yield from your ore, but you can somewhat compensate with more heat.\"",
    },
  },
};
