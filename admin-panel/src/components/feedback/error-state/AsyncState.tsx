import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { LoadingState } from "@/components/feedback/loading-state";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { normalizeApiError } from "@/api";

interface AsyncStateProps {
  children: ReactNode;
  isEmpty: boolean;
  loading: boolean;
  error: unknown;
  delay?: number;
}

const AsyncState = ({
  children,
  isEmpty,
  loading,
  error,
  delay = 500,
}: AsyncStateProps) => {
  const [showEmptyState, setShowEmptyState] = useState(false);

  useEffect(() => {
    if (isEmpty) {
      const timeout = setTimeout(() => setShowEmptyState(true), delay);
      return () => clearTimeout(timeout);
    }

    setShowEmptyState(false);
  }, [delay, isEmpty]);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    const normalizedError = normalizeApiError(error);

    return (
      <ErrorState
        status={normalizedError.status === 401 ? 403 : normalizedError.status}
        message={normalizedError.response}
      />
    );
  }

  if (isEmpty && showEmptyState) {
    return <EmptyState />;
  }

  return <>{children}</>;
};

export default AsyncState;
