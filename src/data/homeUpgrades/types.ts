export const defaultHomeUpgrades = {
  smoker: false,
} as const;

export type HomeUpgradeKeys = keyof typeof defaultHomeUpgrades;
export type HomeUpgradesStore = Record<HomeUpgradeKeys, boolean>;
