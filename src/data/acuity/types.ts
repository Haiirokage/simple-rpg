export type AcuityType = "combat";

export type Acuity = {
  level: number;
  exp: number;
};

export type AcuityStore = Record<AcuityType, Acuity>;
