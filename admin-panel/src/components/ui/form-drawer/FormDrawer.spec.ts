import { describe, expect, it } from "vitest";

describe("FormDrawer", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./FormDrawer");

    expect(subject).toBeDefined();
  });
});
