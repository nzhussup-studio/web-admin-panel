import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/auth/useAuth";
import LoadingState from "@/components/states/LoadingState";

const RequireAuth = ({ children }: { children: ReactNode }) => {
  const { state } = useAuth();

  if (state.loading || !state.isAuthenticated) {
    return <LoadingState />;
  }

  if (!state.roles.includes("ROLE_ADMIN")) {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
};

export default RequireAuth;
