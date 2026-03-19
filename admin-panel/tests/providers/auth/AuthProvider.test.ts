import React, { useContext } from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import { AuthProvider } from "@/providers/auth/AuthProvider";
import { AuthContext } from "@/providers/auth/auth-context";
import keycloak from "@/lib/auth/keycloak";

jest.mock("@/lib/auth/keycloak", () => ({
  __esModule: true,
  default: {
    authenticated: false,
    token: undefined,
    tokenParsed: undefined,
    onAuthSuccess: undefined,
    onAuthRefreshSuccess: undefined,
    onAuthLogout: undefined,
    onTokenExpired: undefined,
    init: jest.fn(),
    login: jest.fn().mockResolvedValue(undefined),
    logout: jest.fn().mockResolvedValue(undefined),
    updateToken: jest.fn().mockResolvedValue(true),
  },
}));

const mockKeycloak = keycloak as jest.Mocked<typeof keycloak>;

const Consumer = () => {
  const context = useContext(AuthContext);

  if (!context) {
    return null;
  }

  return React.createElement(
    "div",
    null,
    React.createElement(
      "span",
      { "data-testid": "auth-state" },
      JSON.stringify(context.state)
    ),
    React.createElement(
      "button",
      {
        type: "button",
        onClick: () => {
          void context.login();
        },
      },
      "login"
    ),
    React.createElement(
      "button",
      {
        type: "button",
        onClick: context.logout,
      },
      "logout"
    )
  );
};

describe("providers/auth/AuthProvider.tsx", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockKeycloak.authenticated = false;
    mockKeycloak.token = undefined;
    mockKeycloak.tokenParsed = undefined;
    mockKeycloak.init.mockResolvedValue(false);
    mockKeycloak.login.mockResolvedValue(undefined);
    mockKeycloak.logout.mockResolvedValue(undefined);
    mockKeycloak.updateToken.mockResolvedValue(true);
  });

  test("initializes keycloak with login-required and settles state", async () => {
    render(React.createElement(AuthProvider, null, React.createElement(Consumer)));

    await waitFor(() =>
      expect(mockKeycloak.init).toHaveBeenCalled()
    );
    expect(mockKeycloak.init).toHaveBeenCalledWith({
      onLoad: "login-required",
      pkceMethod: "S256",
      checkLoginIframe: false,
    });
    await waitFor(() =>
      expect(screen.getByTestId("auth-state")).toHaveTextContent(
        '"isAuthenticated":false'
      )
    );
    expect(screen.getByTestId("auth-state")).toHaveTextContent('"loading":false');
  });

  test("hydrates authenticated state from keycloak", async () => {
    mockKeycloak.authenticated = true;
    mockKeycloak.token = "stored-token";
    mockKeycloak.tokenParsed = {
      exp: Math.floor(Date.now() / 1000) + 3600,
      preferred_username: "admin",
      email: "admin@example.com",
      realm_access: {
        roles: ["ROLE_ADMIN", "ROLE_USER"],
      },
      resource_access: {
        "frontend-auth-client": {
          roles: ["ui-access"],
        },
      },
    };
    mockKeycloak.init.mockResolvedValue(true);

    render(React.createElement(AuthProvider, null, React.createElement(Consumer)));

    await waitFor(() =>
      expect(screen.getByTestId("auth-state")).toHaveTextContent(
        '"isAuthenticated":true'
      )
    );
    expect(screen.getByTestId("auth-state")).toHaveTextContent('"username":"admin"');
    expect(screen.getByTestId("auth-state")).toHaveTextContent('"ROLE_ADMIN"');
    expect(screen.getByTestId("auth-state")).toHaveTextContent('"ui-access"');
  });

  test("login and logout delegate to keycloak", async () => {
    render(React.createElement(AuthProvider, null, React.createElement(Consumer)));

    await waitFor(() =>
      expect(screen.getByTestId("auth-state")).toHaveTextContent('"loading":false')
    );

    act(() => {
      screen.getByText("login").click();
    });
    expect(mockKeycloak.login).toHaveBeenCalled();

    act(() => {
      screen.getByText("logout").click();
    });
    expect(mockKeycloak.logout).toHaveBeenCalled();
  });
});
