import { describe, expect, it } from "vitest";

describe("keycloak", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./keycloak");

    expect(subject).toBeDefined();
  });
});
