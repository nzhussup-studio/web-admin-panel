import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import PublicAlbumGallery from "@/components/albums/PublicAlbumGallery";

describe("components/albums/PublicAlbumGallery.tsx", () => {
  test("renders album images and opens the selected image", () => {
    const onOpenImage = jest.fn();

    render(
      React.createElement(PublicAlbumGallery, {
        images: [
          { id: "img-1", url: "/images/1.jpg" },
          { id: "img-2", url: "/images/2.jpg" },
        ],
        onOpenImage,
      }),
    );

    fireEvent.click(screen.getByRole("button", { name: "Open image img-2" }));
    expect(onOpenImage).toHaveBeenCalledWith(1);
    expect(screen.getByAltText("img-1")).toBeInTheDocument();
  });
});
