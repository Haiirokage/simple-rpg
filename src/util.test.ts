import { describe, it, expect } from "vitest";
import { subtractNumericRecords } from "./util";

describe("subtractNumericRecords", () => {
  it("subtracts numeric values", () => {
    expect(subtractNumericRecords({ copper: 3 }, { copper: 1 })).toEqual({ copper: 2 });
  });

  it("preserves non-numeric fields", () => {
    const base = { type: "metal", copper: 3 } as unknown as { type: string } & Record<
      string,
      number
    >;
    expect(subtractNumericRecords(base, { copper: 1 })).toEqual({ type: "metal", copper: 2 });
  });

  it("preserves keys not in subtractions", () => {
    expect(subtractNumericRecords({ copper: 3, iron: 2 }, { copper: 1 })).toEqual({
      copper: 2,
      iron: 2,
    });
  });
});
