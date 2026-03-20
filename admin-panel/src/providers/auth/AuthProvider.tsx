import { useEffect, useState } from "react";
import LoadingState from "@/components/states/LoadingState";
import { AuthContext } from "@/providers/auth/auth-context";
import {
  getKeycloakInitPromise,
  resetKeycloakInitPromise,
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
const keycloakCallbackStoragePrefix = "kc-callback-";
const authRecoveryFlag = "kc-auth-recovery-attempted";
const authCallbackParams = [
  "code",
  "state",
  "session_state",
  "kc_action_status",
  "kc_action",
  "iss",
  "error",
  "error_description",
];

const clearKeycloakCallbackStorage = () => {
  for (let index = window.localStorage.length - 1; index >= 0; index -= 1) {
    const key = window.localStorage.key(index);

    if (key?.startsWith(keycloakCallbackStoragePrefix)) {
      window.localStorage.removeItem(key);
    }
  }
};

const stripAuthCallbackParams = () => {
  const url = new URL(window.location.href);
  let changed = false;

  authCallbackParams.forEach((param) => {
    if (url.searchParams.has(param)) {
      url.searchParams.delete(param);
      changed = true;
    }
  });

  if (!changed) {
    return;
  }

  const nextUrl = `${url.pathname}${url.search}${url.hash}`;
  window.history.replaceState(window.history.state, "", nextUrl);
};

const resetLocalAuthState = () => {
  keycloak.clearToken();
  resetKeycloakInitPromise();
  clearKeycloakCallbackStorage();
  stripAuthCallbackParams();
};

export const AuthProvider = ({ children }: ProviderProps) => {
  const [state, setState] = useState<AuthState>(initialState);

  useEffect(() => {
    let mounted = true;

    const recoverAuthentication = async () => {
      resetLocalAuthState();

      if (window.sessionStorage.getItem(authRecoveryFlag) === "true") {
        return false;
      }

      window.sessionStorage.setItem(authRecoveryFlag, "true");

      await keycloak.login({
        redirectUri: window.location.href,
        prompt: "login",
      });

      return true;
    };

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

      if (isAuthenticated) {
        window.sessionStorage.removeItem(authRecoveryFlag);
      }
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
        keycloak.onAuthError = () => {
          void recoverAuthentication().catch(() => {
            if (!mounted) {
              return;
            }
            setState({ ...initialState, loading: false });
          });
        };
        keycloak.onAuthRefreshError = () => {
          void recoverAuthentication().catch(() => {
            if (!mounted) {
              return;
            }
            setState({ ...initialState, loading: false });
          });
        };
        keycloak.onAuthLogout = () => {
          window.sessionStorage.removeItem(authRecoveryFlag);
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
              void recoverAuthentication().catch(() => {
                if (!mounted) {
                  return;
                }
                setState({ ...initialState, loading: false });
              });
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
        const recovered = await recoverAuthentication().catch(() => false);
        if (recovered) {
          return;
        }
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
    resetLocalAuthState();
    await keycloak.login(buildLoginOptions());
  };

  const logout = async (redirectUri?: string) => {
    window.sessionStorage.removeItem(authRecoveryFlag);
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
