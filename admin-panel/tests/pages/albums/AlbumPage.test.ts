import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AlbumPage from "@/pages/albums/AlbumPage";
import { AlbumService, ImageService } from "@/lib/api/client";
import { useOptionalGlobalAlert } from "@/hooks/alerts/useOptionalGlobalAlert";
import { useNavigate, useParams } from "react-router-dom";

const mockNavigate = jest.fn();
const mockTriggerAlert = jest.fn();
const mockUseParams = useParams as jest.MockedFunction<typeof useParams>;
const mockUseNavigate = useNavigate as jest.MockedFunction<typeof useNavigate>;
const mockUseOptionalGlobalAlert = useOptionalGlobalAlert as jest.MockedFunction<
  typeof useOptionalGlobalAlert
>;
const mockGetAlbum = AlbumService.getV1Album1 as jest.Mock;
const mockUploadImage = ImageService.postV1AlbumUpload as jest.Mock;
const mockRenameImage = ImageService.patchV1AlbumRename as jest.Mock;
const mockDeleteImage = ImageService.deleteV1Album as jest.Mock;

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));

jest.mock("@/hooks/alerts/useOptionalGlobalAlert", () => ({
  useOptionalGlobalAlert: jest.fn(),
}));

jest.mock("@/lib/api/client", () => ({
  AlbumService: {
    getV1Album1: jest.fn(),
  },
  ImageService: {
    postV1AlbumUpload: jest.fn(),
    patchV1AlbumRename: jest.fn(),
    deleteV1Album: jest.fn(),
  },
}));

jest.mock("@/components/layout/Header", () => ({
  __esModule: true,
  default: ({ text }: { text: string }) => {
    const ReactLocal = require("react");
    return ReactLocal.createElement("div", null, `Header: ${text}`);
  },
}));

jest.mock("@/components/pages/PageState", () => ({
  __esModule: true,
  default: ({
    children,
    isEmpty,
    loading,
    error,
  }: {
    children: React.ReactNode;
    isEmpty: boolean;
    loading: boolean;
    error: unknown;
  }) => {
    const ReactLocal = require("react");
    return ReactLocal.createElement(
      "div",
      {
        "data-testid": "page-state",
        "data-empty": String(isEmpty),
        "data-loading": String(loading),
        "data-error": error ? "true" : "false",
      },
      children,
    );
  },
}));

jest.mock("@/components/shared/Popup", () => ({
  __esModule: true,
  default: ({
    title,
    children,
    onSubmit,
    closePopup,
  }: {
    title: string;
    children: React.ReactNode;
    onSubmit: () => void | Promise<void>;
    closePopup: () => void;
  }) => {
    const ReactLocal = require("react");
    return ReactLocal.createElement(
      "form",
      {
        onSubmit: async (event: React.FormEvent) => {
          event.preventDefault();
          await onSubmit();
        },
      },
      ReactLocal.createElement("div", null, title),
      children,
      ReactLocal.createElement(
        "button",
        { type: "button", onClick: closePopup },
        "Close popup",
      ),
      ReactLocal.createElement("button", { type: "submit" }, "Submit popup"),
    );
  },
}));

jest.mock("@/components/shared/ConfirmDialog", () => ({
  __esModule: true,
  default: ({
    isOpen,
    onConfirm,
    onClose,
  }: {
    isOpen: boolean;
    onConfirm: () => void;
    onClose: () => void;
  }) => {
    const ReactLocal = require("react");
    return isOpen
      ? ReactLocal.createElement(
          "div",
          null,
          ReactLocal.createElement(
            "button",
            { onClick: onConfirm },
            "Confirm delete",
          ),
          ReactLocal.createElement(
            "button",
            { onClick: onClose },
            "Cancel delete",
          ),
        )
      : null;
  },
}));

jest.mock("@/components/albums/FramedImageCard", () => ({
  __esModule: true,
  default: ({
    imageUrl,
    alt,
    onEdit,
    onDelete,
  }: {
    imageUrl: string;
    alt?: string;
    onEdit?: () => void;
    onDelete?: () => void;
  }) => {
    const ReactLocal = require("react");
    return ReactLocal.createElement(
      "div",
      null,
      ReactLocal.createElement("span", null, `${alt}:${imageUrl}`),
      ReactLocal.createElement("button", { onClick: onEdit }, `Edit ${alt}`),
      ReactLocal.createElement(
        "button",
        { onClick: onDelete },
        `Delete ${alt}`,
      ),
    );
  },
}));

const createFileReaderMock = () => {
  class MockFileReader {
    result: string | null = null;

    onloadend: null | (() => void) = null;

    readAsDataURL(file: Blob) {
      this.result = `data:${file.type};base64,mock-preview`;
      setTimeout(() => this.onloadend?.(), 0);
    }
  }

  Object.defineProperty(global, "FileReader", {
    writable: true,
    value: MockFileReader,
  });
};

const createAlbumResponse = () => ({
  data: {
    id: "album-1",
    title: "Summer Album",
    type: "public",
    images: [
      { id: "img-1", url: "/images/1.jpg" },
      { id: "img-2", url: "/images/2.jpg" },
    ],
  },
});

describe("pages/albums/AlbumPage.tsx", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    createFileReaderMock();
    mockUseParams.mockReturnValue({ id: "album-1" });
    mockUseNavigate.mockReturnValue(mockNavigate);
    mockUseOptionalGlobalAlert.mockReturnValue({
      alert: { show: false, message: "", type: "success" },
      triggerAlert: mockTriggerAlert,
      closeAlert: jest.fn(),
    });
    mockGetAlbum.mockResolvedValue(createAlbumResponse());
    mockUploadImage.mockResolvedValue({});
    mockRenameImage.mockResolvedValue({});
    mockDeleteImage.mockResolvedValue({});
  });

  test("fetches the album on mount and renders image cards with prefixed urls", async () => {
    render(React.createElement(AlbumPage));

    await waitFor(() => expect(mockGetAlbum).toHaveBeenCalledWith("album-1"));

    expect(screen.getByText("Header: Album Summer Album")).toBeInTheDocument();
    expect(
      screen.getByText("img-1:http://localhost:8082/images/1.jpg"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("img-2:http://localhost:8082/images/2.jpg"),
    ).toBeInTheDocument();
  });

  test("navigates back and refetches when sort is toggled", async () => {
    render(React.createElement(AlbumPage));

    await waitFor(() => expect(mockGetAlbum).toHaveBeenCalledTimes(1));

    fireEvent.click(screen.getByText("Back"));
    expect(mockNavigate).toHaveBeenCalledWith(-1);

    fireEvent.click(screen.getByText("Sort"));
    await waitFor(() => expect(mockGetAlbum).toHaveBeenCalledTimes(2));
  });

  test("uploads selected files and refreshes the album after submit", async () => {
    render(React.createElement(AlbumPage));
    await waitFor(() => expect(mockGetAlbum).toHaveBeenCalledTimes(1));

    fireEvent.click(screen.getByText("Add Image"));

    const input = screen.getByLabelText("Choose files") as HTMLInputElement;
    const file = new File(["image-bytes"], "summer.png", { type: "image/png" });

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() =>
      expect(screen.getByAltText("Preview 0")).toBeInTheDocument(),
    );

    fireEvent.submit(
      screen.getByText("Submit popup").closest("form") as HTMLFormElement,
    );

    await waitFor(() =>
      expect(mockUploadImage).toHaveBeenCalledWith("album-1", { file }),
    );
    await waitFor(() => expect(mockGetAlbum).toHaveBeenCalledTimes(2));
  });

  test("renames an image and shows a success alert", async () => {
    render(React.createElement(AlbumPage));
    await waitFor(() => expect(mockGetAlbum).toHaveBeenCalledTimes(1));

    fireEvent.click(screen.getByText("Edit img-1"));

    expect(screen.getByText("Edit Image")).toBeInTheDocument();
    expect(screen.getByText("img-1")).toBeInTheDocument();

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "cover-image" },
    });

    fireEvent.submit(
      screen.getByText("Submit popup").closest("form") as HTMLFormElement,
    );

    await waitFor(() =>
      expect(mockRenameImage).toHaveBeenCalledWith(
        "album-1",
        "img-1",
        "cover-image",
      ),
    );
    expect(mockTriggerAlert).toHaveBeenCalledWith(
      "Successfully changed id to cover-image",
      "success",
    );
    await waitFor(() => expect(mockGetAlbum).toHaveBeenCalledTimes(2));
  });

  test("deletes an image after confirmation and refreshes the album", async () => {
    render(React.createElement(AlbumPage));
    await waitFor(() => expect(mockGetAlbum).toHaveBeenCalledTimes(1));

    fireEvent.click(screen.getByText("Delete img-2"));
    fireEvent.click(screen.getByText("Confirm delete"));

    await waitFor(() =>
      expect(mockDeleteImage).toHaveBeenCalledWith("album-1", "img-2"),
    );
    await waitFor(() => expect(mockGetAlbum).toHaveBeenCalledTimes(2));
  });

  test("copies a public link for shareable albums", async () => {
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    });

    render(React.createElement(AlbumPage));
    await waitFor(() => expect(mockGetAlbum).toHaveBeenCalledTimes(1));

    fireEvent.click(screen.getByText("Copy Public Link"));

    await waitFor(() =>
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        "http://localhost/public/albums/album-1",
      ),
    );
    expect(mockTriggerAlert).toHaveBeenCalledWith(
      "Public album link copied to clipboard!",
      "success",
    );
  });

  test("does not render a public link action for private albums", async () => {
    mockGetAlbum.mockResolvedValue({
      data: {
        id: "album-1",
        title: "Private Album",
        type: "private",
        images: [{ id: "img-1", url: "/images/1.jpg" }],
      },
    });

    render(React.createElement(AlbumPage));
    await waitFor(() => expect(mockGetAlbum).toHaveBeenCalledTimes(1));

    expect(screen.queryByText("Copy Public Link")).not.toBeInTheDocument();
  });
});
