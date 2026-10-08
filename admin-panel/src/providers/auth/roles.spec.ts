import { describe, expect, it } from "vitest";
import { ADMIN_ROLE, hasAdminRole } from "./roles";

describe("roles", () => {
  it("only recognizes the exact administrator role", () => {
    expect(hasAdminRole(["ROLE_USER", ADMIN_ROLE])).toBe(true);
    expect(hasAdminRole(["ROLE_USER", "role_admin"])).toBe(false);
    expect(hasAdminRole([])).toBe(false);
  });
});
