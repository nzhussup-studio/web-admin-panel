import { describe, expect, it } from "vitest";
import { getErrorDetails } from "./errorDetails";

describe("getErrorDetails", () => {
  it.each([
    [403, "Access denied"],
    [404, "Page not found"],
    [502, "Bad gateway"],
    [503, "Service unavailable"],
    [504, "Gateway timeout"],
    [500, "Internal server error"],
    [400, "Something went wrong"],
  ])("maps status %i to %s", (status, title) => {
    expect(getErrorDetails(status).title).toBe(title);
  });
});
