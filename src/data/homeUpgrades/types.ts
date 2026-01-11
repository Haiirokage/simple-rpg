export const defaultHomeUpgrades = {
  smoker: false,
  stoneGym: false,
  archery_target: false,
} as const;

export type HomeUpgradeKeys = keyof typeof defaultHomeUpgrades;
export type HomeUpgradesStore = Record<HomeUpgradeKeys, boolean>;
