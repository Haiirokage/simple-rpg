export type EventCategory = "eod" | "system" | "exploration";

export type BaseEvent = {
  id: string;
  name: string;
  category: EventCategory;
};

type EventEffect = "berryMultiplier" | "woodConsumption";

type MonthlyChances = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
];

export type EODEvent = BaseEvent & {
  category: "eod";
  likelihood: MonthlyChances; // 0-1 probability per month, exactly 12 values
  effects: Partial<Record<EventEffect, number>>;
};

export type ExplorationEvent = BaseEvent & {
  category: "exploration";
};

export type SystemEvent = BaseEvent & {
  category: "system";
};

export type AnyEvent = EODEvent | ExplorationEvent | SystemEvent;
