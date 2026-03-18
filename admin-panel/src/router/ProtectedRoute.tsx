import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/auth/useAuth";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { state } = useAuth();

  if (!state.isAuthenticated) {
    return <Navigate to='/login' />;
  }

  return children;
};

export default ProtectedRoute;
