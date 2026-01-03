import { useRef, useEffect } from "preact/hooks";

export const objectKeys = <T extends object>(obj: T): (keyof T)[] => {
  return Object.keys(obj) as (keyof T)[];
};

export const objectEntries = <T extends object>(
  obj: T,
): [keyof T, Exclude<T[keyof T], undefined>][] => {
  return Object.entries(obj) as [keyof T, Exclude<T[keyof T], undefined>][];
};

/**
 * Convert a fractional value to an integer using probability.
 * Floor value is guaranteed, fractional part is probability for +1 bonus.
 *
 * @param value - The fractional value to convert
 * @returns Integer value (floor + probabilistic bonus)
 */
export const rollFractional = (value: number): number => {
  const guaranteed = Math.floor(value);
  const fractional = value % 1;
  const bonus = Math.random() < fractional ? 1 : 0;
  return guaranteed + bonus;
};

/**
 * Hook that returns the previous value of a given state.
 * Useful for calculating deltas between state updates.
 *
 * @param value - The current value to track
 * @returns The previous value from the last render
 */
export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T | undefined>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};
