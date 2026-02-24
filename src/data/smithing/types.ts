export type SmithingTopicId = "copper" | "smelting";

export type CopperKnowledge = "ore";
export type SmeltingKnowledge = "basics";

export type SmithingKnowledgeMap = {
  copper: Record<CopperKnowledge, boolean>;
  smelting: Record<SmeltingKnowledge, boolean>;
};
