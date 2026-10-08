import { describe, expect, it } from "vitest";

describe("Breadcrumbs", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./Breadcrumbs");

    expect(subject).toBeDefined();
  });
});
