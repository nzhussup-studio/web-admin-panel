import { describe, expect, it } from "vitest";

describe("RenameImageField", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./RenameImageField");

    expect(subject).toBeDefined();
  });
});
