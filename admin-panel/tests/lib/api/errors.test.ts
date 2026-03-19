import { ApiError } from "@/lib/api/client";
import { normalizeApiError } from "@/lib/api/errors";

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
});
