import { describe, expect, it } from "vitest";

describe("ProjectsPage", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./ProjectsPage");

    expect(subject).toBeDefined();
  });
});
