import type { ComponentType, ReactNode } from "react";
import { useEffect, useState } from "react";
import config from "@/config/app-config";
import LoadingState from "@/components/states/LoadingState";
import ErrorState from "@/components/states/ErrorState";
import EmptyState from "@/components/states/EmptyState";

interface PageStateProps {
  children: ReactNode;
  isEmpty: boolean;
  loading: boolean;
  error: unknown;
  delay?: number;
  LoadingComponent?: ComponentType;
  ErrorComponent?: ComponentType<any>;
  EmptyComponent?: ComponentType;
}

const PageState = ({
  children,
  isEmpty,
  loading,
  error,
  delay = config.showNoInfoDelay,
  LoadingComponent = LoadingState,
  ErrorComponent = ErrorState,
  EmptyComponent = EmptyState,
}: PageStateProps) => {
  const [showEmptyState, setShowEmptyState] = useState(false);

  useEffect(() => {
    if (isEmpty) {
      const timeout = setTimeout(() => setShowEmptyState(true), delay);
      return () => clearTimeout(timeout);
    }

    setShowEmptyState(false);
  }, [delay, isEmpty]);

  if (loading) {
    return <LoadingComponent />;
  }

  if (error) {
    return <ErrorComponent {...(error as object)} />;
  }

  if (isEmpty && showEmptyState) {
    return <EmptyComponent />;
  }

  return <>{children}</>;
};

export default PageState;
