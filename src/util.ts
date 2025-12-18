export const objectKeys = <T extends object>(obj: T): (keyof T)[] => {
  return Object.keys(obj) as (keyof T)[];
};

export const objectEntries = <T extends object>(
  obj: T,
): [keyof T, Exclude<T[keyof T], undefined>][] => {
  return Object.entries(obj) as [keyof T, Exclude<T[keyof T], undefined>][];
};
