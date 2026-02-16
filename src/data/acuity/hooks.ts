import { useCallback } from "preact/hooks";
import { makeDataQuery, useDefinedQuery, useUpdateData } from "../util";
import { levelUpRecursively } from "../leveling-util";
import type { AcuityStore, AcuityType } from "./types";

const defaultAcuityStore: AcuityStore = {
  combat: { level: 0, exp: 0 },
};

export const acuityQuery = makeDataQuery("ACUITY", defaultAcuityStore);

export const useAcuity = () => {
  const { data } = useDefinedQuery(acuityQuery);
  return data;
};

export const useGrantAcuityExp = () => {
  const acuity = useAcuity();
  const { mutate } = useUpdateData<AcuityStore>("ACUITY", defaultAcuityStore);

  return useCallback(
    (type: AcuityType, amount: number) => {
      const current = acuity[type];
      const updated = levelUpRecursively(current.level, current.exp + amount);
      mutate({ [type]: updated });
    },
    [acuity, mutate],
  );
};
