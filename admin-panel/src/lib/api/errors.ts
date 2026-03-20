import { ApiError } from "@/lib/api/client";

export interface NormalizedApiError {
  status?: number;
  response: string;
  body?: unknown;
}

export const getApiErrorMessage = (
  error: unknown,
  prefix = "Request failed",
) => {
  const normalizedError = normalizeApiError(error);
  return `${prefix}: ${normalizedError.response}`;
};

export const normalizeApiError = (error: unknown): NormalizedApiError => {
  if (typeof ApiError === "function" && error instanceof ApiError) {
    const body = error.body as
      | { message?: string; error?: string; detail?: string }
      | undefined;

    return {
      status: error.status,
      response:
        body?.message ||
        body?.error ||
        body?.detail ||
        error.message ||
        "Request failed",
      body: error.body,
    };
  }

  if (error instanceof Error) {
    return { response: error.message };
  }

  return { response: "An unexpected error occurred." };
};
