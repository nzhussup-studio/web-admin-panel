import { describe, expect, it } from "vitest";

describe("useOptionalGlobalAlert", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./useOptionalGlobalAlert");

    expect(subject).toBeDefined();
  });
});
