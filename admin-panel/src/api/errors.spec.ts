import { describe, expect, it } from "vitest";
import { getApiErrorMessage, normalizeApiError } from "./errors";

describe("API error normalization", () => {
  it("extracts an Axios-style response message and status", () => {
    expect(
      normalizeApiError({
        response: { status: 422, data: { message: "Invalid input" } },
      }),
    ).toEqual({
      status: 422,
      response: "Invalid input",
      body: { message: "Invalid input" },
    });
  });

  it("supports strings and unknown values", () => {
    expect(normalizeApiError("  Offline  ")).toEqual({
      status: 500,
      response: "Offline",
    });
    expect(normalizeApiError(null)).toEqual({
      status: 500,
      response: "An unexpected error occurred.",
    });
  });

  it("adds a caller-provided prefix", () => {
    expect(getApiErrorMessage("Unavailable", "Save failed")).toBe(
      "Save failed: Unavailable",
    );
  });
});
