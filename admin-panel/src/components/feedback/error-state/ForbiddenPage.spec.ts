import { describe, expect, it } from "vitest";

describe("ForbiddenPage", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./ForbiddenPage");

    expect(subject).toBeDefined();
  });
});
