import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import GlobalAlert from "@/components/layout/GlobalAlert";
import { useGlobalAlert } from "@/hooks/alerts/useGlobalAlert";

const mockCloseAlert = jest.fn();
const h = React.createElement;

jest.mock("@/hooks/alerts/useGlobalAlert", () => ({
  useGlobalAlert: jest.fn(),
}));

describe("components/layout/GlobalAlert.tsx", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useGlobalAlert as jest.Mock).mockReturnValue({
      alert: { show: true, message: "Saved successfully", type: "success" },
      triggerAlert: jest.fn(),
      closeAlert: mockCloseAlert,
    });
  });

  test("renders the global alert from context", () => {
    render(h(GlobalAlert));

    expect(screen.getByText("Saved successfully")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveClass("text-bg-success");
  });

  test("uses explicit props when provided and dismisses immediately", () => {
    const onClose = jest.fn();
    render(
      h(GlobalAlert, {
        message: "Custom warning",
        show: true,
        onClose,
        type: "warning",
      })
    );

    expect(screen.getByText("Custom warning")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Dismiss alert"));
    expect(onClose).toHaveBeenCalled();
  });

  test("renders nothing when the alert is hidden", () => {
    (useGlobalAlert as jest.Mock).mockReturnValue({
      alert: { show: false, message: "", type: "info" },
      triggerAlert: jest.fn(),
      closeAlert: mockCloseAlert,
    });

    const { container } = render(h(GlobalAlert));
    expect(container).toBeEmptyDOMElement();
  });
});
