import React, { useContext } from "react";
import { act, render, screen } from "@testing-library/react";
import { GlobalAlertProvider } from "@/providers/alerts/GlobalAlertProvider";
import { GlobalAlertContext } from "@/providers/alerts/global-alert-context";

const Consumer = () => {
  const context = useContext(GlobalAlertContext);

  if (!context) {
    return null;
  }

  return React.createElement(
    "div",
    null,
    React.createElement("span", null, context.alert.show ? "visible" : "hidden"),
    React.createElement("span", null, context.alert.message || "no-message"),
    React.createElement(
      "button",
      {
        type: "button",
        onClick: () => context.triggerAlert("Saved", "success"),
      },
      "trigger"
    ),
    React.createElement(
      "button",
      {
        type: "button",
        onClick: context.closeAlert,
      },
      "close"
    )
  );
};

describe("providers/alerts/GlobalAlertProvider.tsx", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("shows and auto-dismisses alerts", () => {
    render(
      React.createElement(
        GlobalAlertProvider,
        null,
        React.createElement(Consumer)
      )
    );

    act(() => {
      screen.getByText("trigger").click();
    });

    expect(screen.getByText("visible")).toBeInTheDocument();
    expect(screen.getByText("Saved")).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(screen.getByText("hidden")).toBeInTheDocument();
  });

  test("closes alerts immediately", () => {
    render(
      React.createElement(
        GlobalAlertProvider,
        null,
        React.createElement(Consumer)
      )
    );

    act(() => {
      screen.getByText("trigger").click();
      screen.getByText("close").click();
    });

    expect(screen.getByText("hidden")).toBeInTheDocument();
  });
});
