export const getStorage = <T extends Record<string, unknown>>(key: string, fallback: T): T => {
  const item = localStorage.getItem(key);

  if (!item) {
    return fallback;
  }

  const parsed = JSON.parse(item);

  // Merge fallback into parsed to seed any new fields that don't exist yet.
  // This allows adding new fields to default stores without requiring a manual reset.
  return { ...fallback, ...parsed };
};

export const setStorage = <T>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value));
};
