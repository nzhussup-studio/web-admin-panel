import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import FramedImageCard from "@/components/albums/FramedImageCard";
import { useDarkMode } from "@/hooks/theme/useDarkMode";
import { useGlobalAlert } from "@/hooks/alerts/useGlobalAlert";

const mockTriggerAlert = jest.fn();
const mockOnDelete = jest.fn();
const mockOnEdit = jest.fn();
const h = React.createElement;

jest.mock("@/hooks/theme/useDarkMode", () => ({
  useDarkMode: jest.fn(),
}));

jest.mock("@/hooks/alerts/useGlobalAlert", () => ({
  useGlobalAlert: jest.fn(),
}));

describe("components/albums/FramedImageCard.tsx", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useDarkMode as jest.Mock).mockReturnValue({ isDarkMode: false });
    (useGlobalAlert as jest.Mock).mockReturnValue({
      alert: { show: false, message: "", type: "success" },
      triggerAlert: mockTriggerAlert,
      closeAlert: jest.fn(),
    });
    Object.assign(navigator, {
      clipboard: { writeText: jest.fn().mockResolvedValue(undefined) },
    });
  });

  test("copies the image url and triggers a success alert", async () => {
    render(
      h(FramedImageCard, {
        imageUrl: "https://cdn.test/images/1.jpg",
        alt: "hero-image",
      })
    );

    fireEvent.click(screen.getByTestId("image-frame"));

    await waitFor(() =>
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        "https://cdn.test/images/1.jpg"
      )
    );
    expect(mockTriggerAlert).toHaveBeenCalledWith(
      "Image URL copied to clipboard!",
      "success"
    );
    expect(screen.getByText("1.jpg")).toBeInTheDocument();
  });

  test("calls edit and delete actions without bubbling to copy handler", () => {
    render(
      h(FramedImageCard, {
        imageUrl: "https://cdn.test/images/2.jpg",
        alt: "editable-image",
        onEdit: mockOnEdit,
        onDelete: mockOnDelete,
      })
    );

    fireEvent.click(screen.getByLabelText("Edit image"));
    expect(mockOnEdit).toHaveBeenCalled();
    expect(navigator.clipboard.writeText).not.toHaveBeenCalled();

    fireEvent.click(screen.getByLabelText("Delete image"));
    expect(mockOnDelete).toHaveBeenCalled();
  });

  test("falls back to an error alert when copying fails", async () => {
    (navigator.clipboard.writeText as jest.Mock).mockRejectedValue(
      new Error("copy failed")
    );
    jest.spyOn(console, "error").mockImplementation(() => {});

    render(h(FramedImageCard, { imageUrl: "https://cdn.test/images/3.jpg" }));
    fireEvent.click(screen.getByTestId("image-frame"));

    await waitFor(() =>
      expect(mockTriggerAlert).toHaveBeenCalledWith(
        "Failed to copy image URL.",
        "danger"
      )
    );
  });
});
