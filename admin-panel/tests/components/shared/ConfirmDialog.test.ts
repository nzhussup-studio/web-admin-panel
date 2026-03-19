import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { useDarkMode } from "@/hooks/theme/useDarkMode";

const mockOnClose = jest.fn();
const mockOnConfirm = jest.fn();
const h = React.createElement;

jest.mock("@/hooks/theme/useDarkMode", () => ({
  useDarkMode: jest.fn(),
}));

describe("components/shared/ConfirmDialog.tsx", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useDarkMode as jest.Mock).mockReturnValue({ isDarkMode: false });
  });

  test("renders nothing when closed", () => {
    const { container } = render(
      h(ConfirmDialog, { isOpen: false, onClose: mockOnClose, onConfirm: mockOnConfirm })
    );
    expect(container).toBeEmptyDOMElement();
  });

  test("renders custom copy and triggers actions", () => {
    render(
      h(ConfirmDialog, {
        isOpen: true,
        title: "Delete album",
        message: "Delete this album?",
        confirmLabel: "Delete",
        cancelLabel: "Keep",
        onClose: mockOnClose,
        onConfirm: mockOnConfirm,
      })
    );

    expect(screen.getByText("Delete album")).toBeInTheDocument();
    expect(screen.getByText("Delete this album?")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Keep"));
    expect(mockOnClose).toHaveBeenCalled();
    fireEvent.click(screen.getByText("Delete"));
    expect(mockOnConfirm).toHaveBeenCalled();
  });
});
