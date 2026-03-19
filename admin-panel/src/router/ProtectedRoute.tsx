import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/hooks/auth/useAuth";
import LoadingState from "@/components/states/LoadingState";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { state, logout } = useAuth();

  useEffect(() => {
    if (!state.loading && state.isAuthenticated && !state.roles.includes("ROLE_ADMIN")) {
      void logout(`${window.location.origin}/unauthorized`);
    }
  }, [logout, state.isAuthenticated, state.loading, state.roles]);

  if (state.loading || !state.isAuthenticated) {
    return <LoadingState />;
  }

  if (!state.roles.includes("ROLE_ADMIN")) {
    return <LoadingState />;
  }

  return children;
};

export default ProtectedRoute;
