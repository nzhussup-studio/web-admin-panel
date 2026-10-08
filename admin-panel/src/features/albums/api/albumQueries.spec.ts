import { describe, expect, it } from "vitest";

describe("albumQueries", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./albumQueries");

    expect(subject).toBeDefined();
  });
});
