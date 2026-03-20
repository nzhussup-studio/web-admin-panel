import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useParams } from "react-router-dom";
import PublicAlbumPage from "@/pages/albums/PublicAlbumPage";
import { AlbumService } from "@/lib/api/client";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

jest.mock("@/lib/api/client", () => ({
  AlbumService: {
    getV1Album1: jest.fn(),
  },
}));

jest.mock("@/components/layout/Header", () => ({
  __esModule: true,
  default: ({ text }: { text?: string }) => {
    const ReactLocal = require("react");
    return ReactLocal.createElement("div", null, `Header: ${text}`);
  },
}));

const mockUseParams = useParams as jest.MockedFunction<typeof useParams>;
const mockGetAlbum = AlbumService.getV1Album1 as jest.Mock;

describe("pages/albums/PublicAlbumPage.tsx", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseParams.mockReturnValue({ id: "album-1" });
    mockGetAlbum.mockResolvedValue({
      data: {
        id: "album-1",
        title: "Shared Album",
        desc: "Shared memories",
        type: "public",
        images: [
          { id: "img-1", url: "/images/1.jpg" },
          { id: "img-2", url: "/images/2.jpg" },
        ],
      },
    });
  });

  test("renders the public album and opens the lightbox", async () => {
    render(React.createElement(PublicAlbumPage));

    await waitFor(() =>
      expect(screen.getByText("Header: Album Shared Album")).toBeInTheDocument(),
    );
    expect(screen.getByText("Shared memories")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Open image img-1" }));
    expect(await screen.findByText("img-1")).toBeInTheDocument();
  });
});
