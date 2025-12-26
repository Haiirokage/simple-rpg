import { POSITIVE_EVENTS, NEGATIVE_EVENTS, NEUTRAL_EVENTS, type Event } from "./eod-events";
import { SYSTEM_EVENTS } from "./system-events";

const POSITIVE_THRESHOLD = 0.1;
const NEGATIVE_THRESHOLD = 0.1;
const NEUTRAL_THRESHOLD = 0.1;

/**
 * Get event details by ID from all event lists
 */
export const getEventById = (eventId: string): Event | undefined => {
  const systemEvent = SYSTEM_EVENTS[eventId];

  return (
    systemEvent ||
    POSITIVE_EVENTS.find((e) => e.id === eventId) ||
    NEGATIVE_EVENTS.find((e) => e.id === eventId) ||
    NEUTRAL_EVENTS.find((e) => e.id === eventId)
  );
};

/**
 * Pick a weighted-random event from a list based on monthly likelihood.
 * @param eventList Array of events to choose from
 * @param month 0-indexed month (0 = January, 11 = December)
 * @returns Event or null if no viable events for this month
 */
export const pickEventFromList = (eventList: Event[], month: number): Event | null => {
  const totalWeight = eventList.reduce((sum, e) => sum + e.likelihood[month], 0);
  const weightedRoll = Math.random() * totalWeight;

  const findEvent = (index: number, accumulated: number): Event | null => {
    if (index >= eventList.length) {
      return null;
    }

    const newAccumulated = accumulated + eventList[index].likelihood[month];
    if (weightedRoll < newAccumulated) {
      return eventList[index];
    }

    return findEvent(index + 1, newAccumulated);
  };

  return findEvent(0, 0);
};

/**
 * Evaluate if an end-of-day event occurs and return it.
 * First determines event type (positive/negative/neutral/none),
 * then picks from viable events based on month.
 *
 * @param month 0-indexed month (0 = January, 11 = December)
 * @returns Event or null if no event occurs
 */
export const getEndOfDayEvent = (month: number): Event | null => {
  const roll = Math.random();

  if (roll < POSITIVE_THRESHOLD) {
    return pickEventFromList(POSITIVE_EVENTS, month);
  } else if (roll < POSITIVE_THRESHOLD + NEGATIVE_THRESHOLD) {
    return pickEventFromList(NEGATIVE_EVENTS, month);
  } else if (roll < POSITIVE_THRESHOLD + NEGATIVE_THRESHOLD + NEUTRAL_THRESHOLD) {
    return pickEventFromList(NEUTRAL_EVENTS, month);
  } else {
    return null; // no event
  }
};
