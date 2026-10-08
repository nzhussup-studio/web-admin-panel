import { describe, expect, it } from "vitest";

describe("cvExportHtmlTemplates", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./cvExportHtmlTemplates");

    expect(subject).toBeDefined();
  });
});
