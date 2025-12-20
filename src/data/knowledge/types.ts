export type KnowledgeTier = 0 | 1 | 2 | 3;

export interface Knowledge {
  tier: KnowledgeTier;
  /** Level within the tier (1-100) */
  level: number;
}

export type KnowledgeStore = {
  forest: Knowledge;
};
