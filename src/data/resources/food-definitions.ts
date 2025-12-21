import type { ResourceKeys } from "./types";

export const NUTRITION_TYPES = ["carb", "protein", "fruit"] as const;
export type NutritionType = (typeof NUTRITION_TYPES)[number];

export type ResourceDefinition = {
  key: ResourceKeys;
  baseCapacity: number; // capacity without pantries (0 = unlimited)
  capacityPerPantry: number; // bonus capacity per pantry (0 = unlimited)
  decayRate: number; // daily decay as percentage (0 = no decay, 0.05 = 5% per day)
  nutritionType?: NutritionType; // food only
  mealSize?: number; // units consumed per day (food only)
};

export const FOOD_STORAGE: ResourceDefinition[] = [
  {
    key: "berry",
    baseCapacity: 30,
    capacityPerPantry: 300,
    decayRate: 0.05, // 5% decay per day
    nutritionType: "fruit",
    mealSize: 10,
  },
  {
    key: "rabbitMeat",
    baseCapacity: 0,
    capacityPerPantry: 12,
    decayRate: 0.1,
    nutritionType: "protein",
    mealSize: 1,
  },
  {
    key: "jerky",
    baseCapacity: 20,
    capacityPerPantry: 200,
    decayRate: 0.01,
    nutritionType: "protein",
    mealSize: 1,
  },
];
