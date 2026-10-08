import { describe, expect, it } from "vitest";

describe("EducationPage", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./EducationPage");

    expect(subject).toBeDefined();
  });
});
