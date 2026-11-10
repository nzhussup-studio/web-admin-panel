export const createRequestPacer = (intervalMs: number) => {
  let nextStart = 0;
  let reservation = Promise.resolve();

  return async <T>(request: () => Promise<T>): Promise<T> => {
    const previousReservation = reservation;
    let releaseReservation: () => void = () => undefined;
    reservation = new Promise<void>((resolve) => {
      releaseReservation = resolve;
    });

    await previousReservation;
    const now = Date.now();
    const scheduledStart = Math.max(now, nextStart);
    nextStart = scheduledStart + intervalMs;
    releaseReservation();

    const wait = scheduledStart - now;
    if (wait > 0) {
      await new Promise((resolve) => window.setTimeout(resolve, wait));
    }
    return request();
  };
};
