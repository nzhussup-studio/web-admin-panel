import React, { useContext } from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import { AuthProvider } from "@/providers/auth/AuthProvider";
import { AuthContext } from "@/providers/auth/auth-context";

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
        onClick: () => context.login("new-token", "9999999999"),
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
    localStorage.clear();
    jest.restoreAllMocks();
  });

  test("loads as unauthenticated when storage is empty", async () => {
    render(React.createElement(AuthProvider, null, React.createElement(Consumer)));

    await waitFor(() =>
      expect(screen.getByTestId("auth-state")).toHaveTextContent(
        '"isAuthenticated":false'
      )
    );
    expect(screen.getByTestId("auth-state")).toHaveTextContent('"loading":false');
  });

  test("hydrates authenticated state from valid storage and clears expired tokens", async () => {
    localStorage.setItem("token", "stored-token");
    localStorage.setItem(
      "expiration",
      String(Math.floor(Date.now() / 1000) + 3600)
    );

    const { unmount } = render(
      React.createElement(AuthProvider, null, React.createElement(Consumer))
    );

    await waitFor(() =>
      expect(screen.getByTestId("auth-state")).toHaveTextContent(
        '"isAuthenticated":true'
      )
    );
    unmount();

    localStorage.setItem("token", "expired-token");
    localStorage.setItem("expiration", "1");

    render(React.createElement(AuthProvider, null, React.createElement(Consumer)));

    await waitFor(() =>
      expect(screen.getByTestId("auth-state")).toHaveTextContent(
        '"isAuthenticated":false'
      )
    );
    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("expiration")).toBeNull();
  });

  test("login and logout update storage and context state", async () => {
    render(React.createElement(AuthProvider, null, React.createElement(Consumer)));

    await waitFor(() =>
      expect(screen.getByTestId("auth-state")).toHaveTextContent('"loading":false')
    );

    act(() => {
      screen.getByText("login").click();
    });
    expect(localStorage.getItem("token")).toBe("new-token");
    expect(screen.getByTestId("auth-state")).toHaveTextContent('"isAuthenticated":true');

    act(() => {
      screen.getByText("logout").click();
    });
    expect(localStorage.getItem("token")).toBeNull();
    expect(screen.getByTestId("auth-state")).toHaveTextContent('"isAuthenticated":false');
  });
});
