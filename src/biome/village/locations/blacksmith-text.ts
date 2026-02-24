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
      ore: "\"You'll find copper ore in the rocky outcroppings out east. Look for the green staining on the rock — that's where the copper bleeds through. I'll buy whatever you bring me.\"",
    },
  },
  smelting: {
    label: "Smelting",
    entries: {
      basics:
        "\"Smelting's not complicated, but you need the heat right. Charcoal burns hotter than wood — you'll need a proper furnace and patience. Five pieces of that surface ore should yield you a bar or two if you know what you're doing.\"",
    },
  },
};
