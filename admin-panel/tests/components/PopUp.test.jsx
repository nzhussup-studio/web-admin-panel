import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import Popup from "@/components/shared/Popup";
import { ThemeProvider } from "@/providers/theme/ThemeProvider";

// Mock timer functions
jest.useFakeTimers();

const renderWithDarkMode = (component) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe("Popup Component", () => {
  const mockClosePopup = jest.fn();
  const mockOnSubmit = jest.fn();
  const defaultProps = {
    closePopup: mockClosePopup,
    title: "Test Popup",
    onSubmit: mockOnSubmit,
  };

  beforeEach(() => {
    mockClosePopup.mockClear();
    mockOnSubmit.mockClear();
    jest.clearAllTimers();
  });

  test("renders popup with title", () => {
    renderWithDarkMode(
      <Popup {...defaultProps}>
        <div>Popup content</div>
      </Popup>
    );
    expect(screen.getByText("Test Popup")).toBeInTheDocument();
    expect(screen.getByText("Popup content")).toBeInTheDocument();
  });

  test("closes from the modal close button", () => {
    renderWithDarkMode(
      <Popup {...defaultProps}>
        <div>Popup content</div>
      </Popup>
    );
    fireEvent.click(screen.getByLabelText(/close/i));
    expect(mockClosePopup).toHaveBeenCalled();
  });

  test("does not close when clicking popup content", () => {
    renderWithDarkMode(
      <Popup {...defaultProps}>
        <div>Popup content</div>
      </Popup>
    );
    const content = screen.getByTestId("popup-content");
    fireEvent.click(content);
    expect(mockClosePopup).not.toHaveBeenCalled();
  });

  test("handles form submission", async () => {
    mockOnSubmit.mockResolvedValueOnce();
    renderWithDarkMode(
      <Popup {...defaultProps}>
        <div>Popup content</div>
      </Popup>
    );

    const submitButton = screen.getByRole("button", { name: /save/i });
    await act(async () => {
      fireEvent.click(submitButton);
      jest.advanceTimersByTime(200);
    });

    expect(mockOnSubmit).toHaveBeenCalled();
  });

  test("shows loading state during submission", async () => {
    mockOnSubmit.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    );

    renderWithDarkMode(
      <Popup {...defaultProps}>
        <div>Popup content</div>
      </Popup>
    );

    const submitButton = screen.getByRole("button", { name: /save/i });
    await act(async () => {
      fireEvent.click(submitButton);
      jest.advanceTimersByTime(200);
    });

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
  });
});
