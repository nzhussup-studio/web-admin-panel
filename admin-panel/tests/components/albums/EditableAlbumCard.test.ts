import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import EditableAlbumCard from "@/components/albums/EditableAlbumCard";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "@/hooks/theme/useDarkMode";

const mockNavigate = jest.fn();
const mockOnEdit = jest.fn();
const mockOnDelete = jest.fn();
const h = React.createElement;

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

jest.mock("@/hooks/theme/useDarkMode", () => ({
  useDarkMode: jest.fn(),
}));

describe("components/albums/EditableAlbumCard.tsx", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useDarkMode as jest.Mock).mockReturnValue({ isDarkMode: false });
  });

  test("renders album details and navigates on card click", () => {
    render(
      h(EditableAlbumCard, {
        album: {
          id: "album-1",
          title: "Summer Trip",
          description: "Trip photos",
          images_count: 8,
          preview_image: "https://cdn.test/preview.jpg",
        },
      })
    );

    fireEvent.click(screen.getByText("Summer Trip"));
    expect(mockNavigate).toHaveBeenCalledWith("/albums/album-1");
    expect(screen.getByText("📸 8 images")).toBeInTheDocument();
  });

  test("renders placeholder text and buttons when callbacks are provided", () => {
    render(
      h(EditableAlbumCard, {
        album: { id: 1, title: "Untitled", images_count: 0 },
        onEdit: mockOnEdit,
        onDelete: mockOnDelete,
      })
    );

    expect(screen.getByText("No description")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Edit album"));
    expect(mockOnEdit).toHaveBeenCalledWith(
      expect.objectContaining({ id: 1, title: "Untitled" })
    );
    expect(mockNavigate).not.toHaveBeenCalled();

    fireEvent.click(screen.getByLabelText("Delete album"));
    expect(mockOnDelete).toHaveBeenCalledWith(
      expect.objectContaining({ id: 1, title: "Untitled" })
    );
  });

  test("applies dark-mode text styling", () => {
    (useDarkMode as jest.Mock).mockReturnValue({ isDarkMode: true });

    const { container } = render(
      h(EditableAlbumCard, { album: { id: 1, title: "Dark Album" } })
    );

    expect(container.firstChild).toHaveClass("text-white");
  });
});
