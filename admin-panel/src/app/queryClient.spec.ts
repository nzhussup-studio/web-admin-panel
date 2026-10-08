import { describe, expect, it } from "vitest";

describe("queryClient", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./queryClient");

    expect(subject).toBeDefined();
  });
});
