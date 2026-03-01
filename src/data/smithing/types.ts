export type SmithingTopicId = "copper" | "smelting" | "casting";

export type CopperKnowledge = "ore";
export type SmeltingKnowledge = "basics";
export type CastingKnowledge = "knifeBlade" | "axeHead";

export type SmithingKnowledgeMap = {
  copper: Record<CopperKnowledge, boolean>;
  smelting: Record<SmeltingKnowledge, boolean>;
  casting: Record<CastingKnowledge, boolean>;
};
