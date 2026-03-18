import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import ClearCacheButton from "@/components/shared/ClearCacheButton";
import { CacheService } from "@/lib/api/client";

jest.mock("@/lib/api/client", () => ({
  CacheService: {
    deleteV1AlbumCache: jest.fn(),
  },
}));

describe("ClearCacheButton Component", () => {
  const mockTriggerAlertHandler = jest.fn();

  beforeEach(() => {
    CacheService.deleteV1AlbumCache.mockClear();
    mockTriggerAlertHandler.mockClear();
  });

  test("renders clear cache button", () => {
    render(<ClearCacheButton triggerAlertHandler={mockTriggerAlertHandler} />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/clear cache/i);
  });

  test("handles successful cache clearing", async () => {
    CacheService.deleteV1AlbumCache.mockResolvedValueOnce();

    render(<ClearCacheButton triggerAlertHandler={mockTriggerAlertHandler} />);
    const button = screen.getByRole("button");

    await act(async () => {
      fireEvent.click(button);
    });

    expect(CacheService.deleteV1AlbumCache).toHaveBeenCalledTimes(1);
    expect(mockTriggerAlertHandler).toHaveBeenCalledWith(null);
  });

  test("handles cache clearing error", async () => {
    const error = new Error("Failed to clear cache");
    CacheService.deleteV1AlbumCache.mockRejectedValueOnce(error);

    render(<ClearCacheButton triggerAlertHandler={mockTriggerAlertHandler} />);
    const button = screen.getByRole("button");

    await act(async () => {
      fireEvent.click(button);
    });

    expect(CacheService.deleteV1AlbumCache).toHaveBeenCalledTimes(1);
    expect(mockTriggerAlertHandler).toHaveBeenCalledWith(error);
  });

  test("disables button while clearing", async () => {
    // Create a promise that we can resolve manually
    let resolvePromise;
    const clearPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    CacheService.deleteV1AlbumCache.mockImplementationOnce(() => clearPromise);

    render(<ClearCacheButton triggerAlertHandler={mockTriggerAlertHandler} />);
    const button = screen.getByRole("button");

    // Click the button but don't resolve the promise yet
    fireEvent.click(button);

    // Button should be disabled and show loading state
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent(/clearing/i);

    // Resolve the promise
    await act(async () => {
      resolvePromise();
    });

    // Button should be enabled again
    expect(button).not.toBeDisabled();
    expect(button).toHaveTextContent(/clear cache/i);
  });
});
