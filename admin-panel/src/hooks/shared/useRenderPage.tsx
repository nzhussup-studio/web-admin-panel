import type { ComponentType, ReactNode } from "react";
import { useEffect, useState } from "react";
import config from "@/config/app-config";

export const useRenderPage = (
  items: unknown[],
  showLoading: boolean,
  error: any,
  delay = config.showNoInfoDelay
) => {
  const [delayed, setDelayed] = useState(false);

  useEffect(() => {
    if (items.length <= 0) {
      const timeout = setTimeout(() => setDelayed(true), delay);
      return () => clearTimeout(timeout);
    }

    setDelayed(false);
  }, [items, delay]);

  const renderPage = (
    ErrorElement: ComponentType<any>,
    LoadingElement: ComponentType,
    NoInfoFoundElement: ComponentType,
    itemPage: ReactNode
  ) => {
    if (showLoading) return <LoadingElement />;
    if (error) return <ErrorElement {...error} />;
    if (items.length <= 0 && delayed) return <NoInfoFoundElement />;
    return itemPage;
  };

  return { renderPage };
};
