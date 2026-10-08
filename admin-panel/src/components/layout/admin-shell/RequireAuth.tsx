import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { hasAdminRole, useAuth } from "@/providers/auth";
import { LoadingPage } from "@/components/feedback/loading-state";

const RequireAuth = ({ children }: { children: ReactNode }) => {
  const { state } = useAuth();

  if (state.loading) {
    return <LoadingPage />;
  }

  if (!state.isAuthenticated) {
    return <Navigate to="/forbidden" replace />;
  }

  if (!hasAdminRole(state.roles)) {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
};

export default RequireAuth;
