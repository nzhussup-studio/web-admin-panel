import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import config from "@/config/app-config";
import LoadingState from "@/components/states/LoadingState";
import UnauthorizedPage from "@/pages/errors/UnauthorizedPage";

interface PageStateProps {
  children: ReactNode;
  isEmpty: boolean;
  loading: boolean;
  error: unknown;
  delay?: number;
}

const PageState = ({
  children,
  isEmpty,
  loading,
  error,
  delay = config.showNoInfoDelay,
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
    return <LoadingState />;
  }

  if (error) {
    const normalizedError = error as { status?: number; response?: string };

    if (normalizedError.status === 401) {
      return <UnauthorizedPage showHeader={false} />;
    }

    if (normalizedError.status === 404) {
      return (
        <div className='py-5 text-center'>
          <h1 className='display-6 mb-3'>404</h1>
          <p className='text-secondary mb-0'>The requested resource was not found.</p>
        </div>
      );
    }

    return (
      <div className='py-5 text-center'>
        <h1 className='display-6 mb-3'>500 - Internal Server Error</h1>
        <p className='text-secondary mb-0'>
          {normalizedError.response || "Something went wrong."}
        </p>
      </div>
    );
  }

  if (isEmpty && showEmptyState) {
    return (
      <div className='py-5 text-center'>
        <h1 className='h3 mb-0'>No information found.</h1>
      </div>
    );
  }

  return <>{children}</>;
};

export default PageState;
