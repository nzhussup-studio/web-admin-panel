import { useEffect, useState } from "react";
import LoadingState from "@/components/states/LoadingState";
import { AuthContext } from "@/providers/auth/auth-context";
import {
  getKeycloakInitPromise,
  setKeycloakInitPromise,
} from "@/providers/auth/keycloak-init";
import type { AuthState, ProviderProps } from "@/types/common";
import keycloak from "@/lib/auth/keycloak";

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  expiration: null,
  loading: true,
  roles: [],
  username: null,
  firstName: null,
  lastName: null,
  email: null,
};

const getRoles = () => {
  const realmRoles = keycloak.tokenParsed?.realm_access?.roles ?? [];
  const clientRoles = Object.values(
    keycloak.tokenParsed?.resource_access ?? {},
  ).flatMap((access) => access.roles ?? []);

  return Array.from(new Set([...realmRoles, ...clientRoles]));
};

const buildLoginOptions = () => {
  return {
    redirectUri: window.location.href,
  };
};

const isPublicPath = (pathname: string) => pathname.startsWith("/public/");

export const AuthProvider = ({ children }: ProviderProps) => {
  const [state, setState] = useState<AuthState>(initialState);

  useEffect(() => {
    let mounted = true;

    const syncState = async () => {
      const isAuthenticated = !!keycloak.authenticated;
      const roles = getRoles();
      const username = keycloak.tokenParsed?.preferred_username ?? null;
      const firstName = keycloak.tokenParsed?.given_name ?? null;
      const lastName = keycloak.tokenParsed?.family_name ?? null;
      const email = keycloak.tokenParsed?.email ?? null;

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
        firstName,
        lastName,
        email,
      });
    };

    const initialize = async () => {
      try {
        const onLoad = isPublicPath(window.location.pathname)
          ? "check-sso"
          : "login-required";

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
          void keycloak
            .updateToken(30)
            .then(syncState)
            .catch(() => {
              void keycloak.login(buildLoginOptions());
            });
        };

        if (!getKeycloakInitPromise()) {
          setKeycloakInitPromise(
            keycloak.init({
              onLoad,
              pkceMethod: "S256",
              checkLoginIframe: false,
            }),
          );
        }

        await getKeycloakInitPromise();

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
    await keycloak.login(buildLoginOptions());
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
