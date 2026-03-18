import { ApiError } from "@/lib/api/client";

export interface NormalizedApiError {
  status?: number;
  response: string;
  body?: unknown;
}

export const normalizeApiError = (error: unknown): NormalizedApiError => {
  if (error instanceof ApiError) {
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
