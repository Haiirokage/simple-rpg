import {
  useMutation,
  useQuery,
  useQueryClient,
  type DefinedUseQueryResult,
} from "@tanstack/react-query";

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

export const useDataQuery = <T extends Record<string, unknown>>(key: string, fallback: T) => {
  const getData = () => getStorage(key, fallback);

  return useQuery({
    queryKey: [key],
    queryFn: () => getData(),
    initialData: fallback,
  }) as DefinedUseQueryResult<T, Error>;
};

export const useUpdateData = <T extends Record<string, unknown>>(key: string, defaultStore: T) => {
  const queryClient = useQueryClient();
  const { data } = useDataQuery<T>(key, defaultStore);

  const setData = (newData: T) => {
    setStorage(key, newData);
  };

  return useMutation<void, Error, Partial<T>>({
    mutationFn: async (updates) => setData({ ...data, ...updates }),
    onMutate: (updates) => {
      queryClient.setQueryData([key], { ...data, ...updates });
    },
  });
};
