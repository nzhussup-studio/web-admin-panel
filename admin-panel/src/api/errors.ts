import { ApiError } from "./client";

export interface NormalizedApiError {
  status: number;
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
      | {
          message?: string;
          error?: string | { message?: string; detail?: string };
          detail?: string;
        }
      | undefined;
    const nestedMessage =
      typeof body?.error === "object"
        ? body.error.message || body.error.detail
        : body?.error;

    return {
      status: error.status,
      response:
        body?.message ||
        nestedMessage ||
        body?.detail ||
        error.message ||
        "Request failed",
      body: error.body,
    };
  }

  if (error && typeof error === "object") {
    const candidate = error as {
      status?: number;
      message?: string;
      response?:
        | string
        | { status?: number; data?: unknown; statusText?: string };
    };
    if (typeof candidate.response === "string") {
      return {
        status: candidate.status ?? 500,
        response: candidate.response,
      };
    }

    const body = candidate.response?.data;
    const bodyRecord =
      body && typeof body === "object"
        ? (body as {
            message?: string;
            detail?: string;
            error?: string | { message?: string };
          })
        : null;
    const nestedError =
      typeof bodyRecord?.error === "object"
        ? bodyRecord.error.message
        : bodyRecord?.error;

    return {
      status: candidate.response?.status ?? candidate.status ?? 500,
      response:
        bodyRecord?.message ||
        bodyRecord?.detail ||
        nestedError ||
        (typeof body === "string" ? body : undefined) ||
        candidate.message ||
        candidate.response?.statusText ||
        "Request failed",
      body,
    };
  }

  if (error instanceof Error) {
    return { status: 500, response: error.message || "Request failed" };
  }

  if (typeof error === "string" && error.trim()) {
    return { status: 500, response: error.trim() };
  }

  return { status: 500, response: "An unexpected error occurred." };
};
