import { describe, expect, it } from "vitest";

describe("CertificationsPage", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./CertificationsPage");

    expect(subject).toBeDefined();
  });
});
