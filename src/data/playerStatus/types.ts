export const defaultPlayerStatus = {
  satiation: 60,
  maxSatiation: 80,
  energy: 100,
  maxEnergy: 100,
  health: 100,
  maxHealth: 100,
} as const;

export type PlayerStatusKeys = keyof typeof defaultPlayerStatus;
export type PlayerStatus = Record<PlayerStatusKeys, number>;
