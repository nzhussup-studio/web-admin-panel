import { useEffect, useState } from "react";
import LoadingState from "@/components/states/LoadingState";
import { AuthContext } from "@/providers/auth/auth-context";
import type { AuthState, ProviderProps } from "@/types/common";

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  expiration: null,
  loading: true,
};

export const AuthProvider = ({ children }: ProviderProps) => {
  const [state, setState] = useState<AuthState>(initialState);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");

    if (token && expirationDate) {
      const expirationTime = parseInt(expirationDate, 10) * 1000;
      if (expirationTime > new Date().getTime()) {
        setState({
          isAuthenticated: true,
          token,
          expiration: expirationDate,
          loading: false,
        });
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("expiration");
        setState({
          isAuthenticated: false,
          token: null,
          expiration: null,
          loading: false,
        });
      }
    } else {
      setState({
        isAuthenticated: false,
        token: null,
        expiration: null,
        loading: false,
      });
    }
  }, []);

  const login = (token: string, expiration: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expiration);
    setState({ isAuthenticated: true, token, expiration, loading: false });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    setState({
      isAuthenticated: false,
      token: null,
      expiration: null,
      loading: false,
    });
  };

  if (state.loading) {
    return <LoadingState />;
  }

  return (
    <AuthContext.Provider value={{ state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
