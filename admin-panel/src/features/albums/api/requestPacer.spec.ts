import { afterEach, describe, expect, it, vi } from "vitest";
import { createRequestPacer } from "./requestPacer";

describe("createRequestPacer", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("spaces concurrent request starts by the configured interval", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
    const starts: number[] = [];
    const pace = createRequestPacer(100);
    const request = () => {
      starts.push(Date.now());
      return Promise.resolve();
    };

    const pending = [pace(request), pace(request), pace(request)];
    await vi.advanceTimersByTimeAsync(0);
    expect(starts).toEqual([0]);
    await vi.advanceTimersByTimeAsync(100);
    expect(starts).toEqual([0, 100]);
    await vi.advanceTimersByTimeAsync(100);
    expect(starts).toEqual([0, 100, 200]);
    await Promise.all(pending);
  });
});
