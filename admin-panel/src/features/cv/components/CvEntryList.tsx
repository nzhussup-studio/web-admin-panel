import type { ReactNode } from "react";

export function CvEntryList({ children }: { children: ReactNode }) {
  return <div className="d-grid gap-3">{children}</div>;
}
