import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import AlbumLightboxModal from "@/components/albums/AlbumLightboxModal";

describe("components/albums/AlbumLightboxModal.tsx", () => {
  test("renders the selected image inside the carousel modal", () => {
    render(
      React.createElement(AlbumLightboxModal, {
        albumTitle: "Summer",
        images: [
          { id: "img-1", url: "/images/1.jpg" },
          { id: "img-2", url: "/images/2.jpg" },
        ],
        selectedImageIndex: 1,
        onClose: jest.fn(),
        onSelectImage: jest.fn(),
      }),
    );

    expect(screen.getByText("img-2")).toBeInTheDocument();
    expect(screen.getByAltText("img-2")).toBeInTheDocument();
  });

  test("supports keyboard navigation with arrow keys", () => {
    const onSelectImage = jest.fn();

    render(
      React.createElement(AlbumLightboxModal, {
        albumTitle: "Summer",
        images: [
          { id: "img-1", url: "/images/1.jpg" },
          { id: "img-2", url: "/images/2.jpg" },
        ],
        selectedImageIndex: 0,
        onClose: jest.fn(),
        onSelectImage,
      }),
    );

    fireEvent.keyDown(window, { key: "ArrowRight" });
    expect(onSelectImage).toHaveBeenCalledWith(1);

    fireEvent.keyDown(window, { key: "ArrowLeft" });
    expect(onSelectImage).toHaveBeenCalledWith(1);
  });
});
