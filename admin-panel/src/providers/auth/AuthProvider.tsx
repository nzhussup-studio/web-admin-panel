import { useEffect, useState } from "react";
import LoadingState from "@/components/states/LoadingState";
import { AuthContext } from "@/providers/auth/auth-context";
import type { AuthState, ProviderProps } from "@/types/common";
import keycloak from "@/lib/auth/keycloak";

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  expiration: null,
  loading: true,
  roles: [],
  username: null,
  email: null,
};

let keycloakInitPromise: Promise<boolean> | null = null;

const getRoles = () => {
  const realmRoles = keycloak.tokenParsed?.realm_access?.roles ?? [];
  const clientRoles = Object.values(keycloak.tokenParsed?.resource_access ?? {}).flatMap(
    (access) => access.roles ?? []
  );

  return Array.from(new Set([...realmRoles, ...clientRoles]));
};

export const AuthProvider = ({ children }: ProviderProps) => {
  const [state, setState] = useState<AuthState>(initialState);

  useEffect(() => {
    let mounted = true;
    const isUnauthorizedRoute = window.location.pathname === "/unauthorized";

    const syncState = async () => {
      const isAuthenticated = !!keycloak.authenticated;
      const roles = getRoles();
      const username = keycloak.tokenParsed?.preferred_username ?? null;
      const email = keycloak.tokenParsed?.email ?? null;
      const isUnauthorizedAdminUser = isAuthenticated && !isUnauthorizedRoute && !roles.includes("ROLE_ADMIN");

      if (isUnauthorizedAdminUser) {
        setState(initialState);
        await keycloak.logout({
          redirectUri: `${window.location.origin}/unauthorized`,
        });
        return;
      }

      if (!mounted) {
        return;
      }

      setState({
        isAuthenticated,
        token: keycloak.token ?? null,
        expiration: keycloak.tokenParsed?.exp?.toString() ?? null,
        loading: false,
        roles,
        username,
        email,
      });
    };

    const initialize = async () => {
      try {
        keycloak.onAuthSuccess = () => {
          void syncState();
        };
        keycloak.onAuthRefreshSuccess = () => {
          void syncState();
        };
        keycloak.onAuthLogout = () => {
          if (!mounted) {
            return;
          }
          setState({ ...initialState, loading: false });
        };
        keycloak.onTokenExpired = () => {
          void keycloak.updateToken(30).then(syncState).catch(() => {
            void keycloak.login({
              redirectUri: window.location.href,
            });
          });
        };

        if (!keycloakInitPromise) {
          keycloakInitPromise = keycloak.init({
            onLoad: isUnauthorizedRoute ? "check-sso" : "login-required",
            pkceMethod: "S256",
            checkLoginIframe: false,
          });
        }

        await keycloakInitPromise;

        await syncState();
      } catch {
        if (!mounted) {
          return;
        }
        setState({ ...initialState, loading: false });
      }
    };

    void initialize();

    return () => {
      mounted = false;
    };
  }, []);

  const login = async () => {
    await keycloak.login({
      redirectUri: window.location.href,
    });
  };

  const logout = async (redirectUri?: string) => {
    await keycloak.logout({
      redirectUri: redirectUri ?? window.location.origin,
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

export const resetKeycloakInitPromiseForTests = () => {
  keycloakInitPromise = null;
};
