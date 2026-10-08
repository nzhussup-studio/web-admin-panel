import { describe, expect, it } from "vitest";

describe("useResourceEditor", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./useResourceEditor");

    expect(subject).toBeDefined();
  });
});
