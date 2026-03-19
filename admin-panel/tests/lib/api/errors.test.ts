import { ApiError } from "@/lib/api/client";
import { getApiErrorMessage, normalizeApiError } from "@/lib/api/errors";

describe("lib/api/errors.ts", () => {
  test("normalizes ApiError instances using body message fields", () => {
    const apiError = new ApiError(
      { method: "GET", path: "/projects" } as never,
      {
        url: "",
        ok: false,
        status: 400,
        statusText: "Bad Request",
        body: { message: "Invalid data" },
      } as never,
      "Bad Request"
    );

    expect(normalizeApiError(apiError)).toEqual({
      status: 400,
      response: "Invalid data",
      body: { message: "Invalid data" },
    });
  });

  test("normalizes generic Error and unknown values", () => {
    expect(normalizeApiError(new Error("Nope"))).toEqual({ response: "Nope" });
    expect(normalizeApiError("oops")).toEqual({
      response: "An unexpected error occurred.",
    });
  });

  test("builds prefixed API error messages", () => {
    const apiError = new ApiError(
      { method: "POST", path: "/projects" } as never,
      {
        url: "",
        ok: false,
        status: 500,
        statusText: "Server Error",
        body: { detail: "Database unavailable" },
      } as never,
      "Server Error"
    );

    expect(getApiErrorMessage(apiError, "Failed to save project")).toBe(
      "Failed to save project: Database unavailable"
    );
    expect(getApiErrorMessage(new Error("Network down"), "Failed to load")).toBe(
      "Failed to load: Network down"
    );
  });
});
