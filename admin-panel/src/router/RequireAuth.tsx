import type { ReactNode } from "react";
import { useAuth } from "@/hooks/auth/useAuth";
import LoadingState from "@/components/states/LoadingState";

const RequireAuth = ({ children }: { children: ReactNode }) => {
  const { state } = useAuth();

  if (state.loading || !state.isAuthenticated) {
    return <LoadingState />;
  }

  return children;
};

export default RequireAuth;
