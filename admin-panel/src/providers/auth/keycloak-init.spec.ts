import { describe, expect, it } from "vitest";

describe("keycloak-init", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./keycloak-init");

    expect(subject).toBeDefined();
  });
});
