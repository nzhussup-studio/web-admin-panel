import { useEffect, useState, type PropsWithChildren } from "react";
import { AuthContext } from "@/providers/auth/auth-context";
import {
  getKeycloakInitPromise,
  resetKeycloakInitPromise,
  setKeycloakInitPromise,
} from "@/providers/auth/keycloak-init";
import type { AuthState } from "./auth-context";
import keycloak from "./keycloak";

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

const isPublicPath = (pathname: string) =>
  /^\/albums\/[^/]+\/?$/.test(pathname);
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

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [state, setState] = useState<AuthState>(initialState);

  useEffect(() => {
    let mounted = true;
    const publicPath = isPublicPath(window.location.pathname);

    const settleAsGuest = () => {
      if (mounted) {
        setState({ ...initialState, loading: false });
      }
    };

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
        keycloak.onAuthSuccess = () => {
          void syncState();
        };
        keycloak.onAuthRefreshSuccess = () => {
          void syncState();
        };
        keycloak.onAuthError = () => {
          if (publicPath) {
            settleAsGuest();
            return;
          }
          void recoverAuthentication().catch(() => {
            settleAsGuest();
          });
        };
        keycloak.onAuthRefreshError = () => {
          if (publicPath) {
            resetLocalAuthState();
            settleAsGuest();
            return;
          }
          void recoverAuthentication().catch(() => {
            settleAsGuest();
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
              if (publicPath) {
                resetLocalAuthState();
                settleAsGuest();
                return;
              }
              void recoverAuthentication().catch(() => {
                settleAsGuest();
              });
            });
        };

        if (!getKeycloakInitPromise()) {
          setKeycloakInitPromise(
            keycloak.init({
              onLoad: publicPath ? "check-sso" : "login-required",
              pkceMethod: "S256",
              checkLoginIframe: false,
            }),
          );
        }

        await getKeycloakInitPromise();

        await syncState();
      } catch {
        if (publicPath) {
          settleAsGuest();
          return;
        }
        const recovered = await recoverAuthentication().catch(() => false);
        if (recovered) {
          return;
        }
        settleAsGuest();
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

  return (
    <AuthContext.Provider value={{ state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
