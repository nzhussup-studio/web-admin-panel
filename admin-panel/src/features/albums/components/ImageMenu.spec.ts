import { describe, expect, it } from "vitest";

describe("ImageMenu", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./ImageMenu");

    expect(subject).toBeDefined();
  });
});
