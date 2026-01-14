import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
  type DefinedUseQueryResult,
} from "@tanstack/react-query";

export const getStorage = <T extends Record<string, unknown>>(key: string, fallback: T): T => {
  const item = localStorage.getItem(key);

  if (!item) {
    console.log("no item", key, item);
    return fallback;
  }

  const parsed = JSON.parse(item);

  // Merge fallback into parsed to seed any new fields that don't exist yet.
  // This allows adding new fields to default stores without requiring a manual reset.
  return { ...fallback, ...parsed };
};

export const setStorage = async <T>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const useDataQuery = <T extends Record<string, unknown>>(key: string, fallback: T) => {
  return useQuery({
    queryKey: [key],
    queryFn: () => getStorage(key, fallback),
    initialData: fallback,
  }) as DefinedUseQueryResult<T, Error>;
};

export const useUpdateData = <T extends Record<string, unknown>>(key: string, defaultStore: T) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, Partial<T>>({
    mutationKey: [key],
    mutationFn: async (updates) => {
      const previousData = queryClient.getQueryData<T>([key]) || defaultStore;
      setStorage(key, { ...previousData, ...updates });
    },
    onMutate: (updates) => {
      const previousData = queryClient.getQueryData<T>([key]) || defaultStore;
      queryClient.setQueryData([key], { ...previousData, ...updates });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [key] });
    },
  });
};

export const waitForCache = async (queryClient: QueryClient, callback: () => void) => {
  const pendingMutations = queryClient
    .getMutationCache()
    .getAll()
    .filter((mutation) => mutation.state.status === "pending")
    .map((m) => m.execute);
  if (pendingMutations) {
    try {
      await Promise.all(pendingMutations);
    } catch (e) {
      console.log("fail", e);
    }
  }
  callback();
};
