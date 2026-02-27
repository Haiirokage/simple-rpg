import type { SmithingKnowledgeMap } from "../../../../data/smithing/types";

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
      ore: "\"Copper ore, it's not rare, but finding it on the surface is unusual. The ore is low quality, but I'll buy whatever you bring me.\"",
    },
  },
  smelting: {
    label: "Smelting",
    entries: {
      basics:
        "\"Smelting's not complicated, but you need the heat right. Charcoal burns hot, you'll need a proper furnace and patience. It will take time and skill to get the proper yield from your ore, but you can somewhat compensate with more heat.\"",
    },
  },
  casting: {
    label: "Casting",
    entries: {
      knifeBlade:
        "He turns the bar over in his hands, nice work, now you can begin making something useful. \"Casting's not complicated once you know what you're doing. You start with casting sand, pack it tight in a frame, then press your pattern into it to leave the shape you want. Melt your metal, and pour it in. A knife blade is a good first piece. Simple shape, one bar, not much that can go wrong.\"",
    },
  },
};
