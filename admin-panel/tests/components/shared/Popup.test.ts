import React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import Popup from "@/components/shared/Popup";
import { useDarkMode } from "@/hooks/theme/useDarkMode";

const mockClosePopup = jest.fn();
const h = React.createElement;

jest.mock("@/hooks/theme/useDarkMode", () => ({
  useDarkMode: jest.fn(),
}));

describe("components/shared/Popup.tsx", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useDarkMode as jest.Mock).mockReturnValue({ isDarkMode: false });
  });

  test("renders title, content, and closes from cancel", () => {
    render(
      h(
        Popup,
        {
          closePopup: mockClosePopup,
          title: "Edit item",
          onSubmit: jest.fn(),
        },
        h("div", null, "Popup body")
      )
    );

    expect(screen.getByText("Edit item")).toBeInTheDocument();
    expect(screen.getByText("Popup body")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Cancel"));
    expect(mockClosePopup).toHaveBeenCalled();
  });

  test("submits async content and shows loading state when delayed", async () => {
    jest.useFakeTimers();
    const onSubmit = jest.fn(
      () => new Promise<void>((resolve) => setTimeout(resolve, 150))
    );

    render(
      h(
        Popup,
        { closePopup: mockClosePopup, title: "Save item", onSubmit },
        h("div", null, "Popup body")
      )
    );

    fireEvent.click(screen.getByText("Save"));
    expect(onSubmit).toHaveBeenCalled();

    await act(async () => {
      jest.advanceTimersByTime(101);
    });
    expect(screen.getByText("Saving...")).toBeInTheDocument();

    await act(async () => {
      jest.advanceTimersByTime(100);
    });
    await waitFor(() =>
      expect(screen.queryByText("Saving...")).not.toBeInTheDocument()
    );
    jest.useRealTimers();
  });
});
