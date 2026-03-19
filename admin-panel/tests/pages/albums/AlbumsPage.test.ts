import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import AlbumsPage from "@/pages/albums/AlbumsPage";
import { useCrudPage } from "@/hooks/crud/useCrudPage";

const mockOpenPopup = jest.fn();
const mockConfirmDelete = jest.fn();
const mockClosePopup = jest.fn();
const mockSaveItem = jest.fn();
const mockSetFormData = jest.fn();
const mockToggleSort = jest.fn();
const mockCloseDeleteModal = jest.fn();
const mockHandleDelete = jest.fn();
const mockOnAdd: Array<() => void> = [];

jest.mock("@/hooks/crud/useCrudPage", () => ({
  useCrudPage: jest.fn(),
}));

jest.mock("@/components/pages/CrudPageLayout", () => ({
  __esModule: true,
  default: ({
    title,
    onAdd,
    children,
    modal,
    deleteDialog,
  }: {
    title: string;
    onAdd?: () => void;
    children: React.ReactNode;
    modal?: React.ReactNode;
    deleteDialog?: React.ReactNode;
  }) => {
    if (onAdd) {
      mockOnAdd.push(onAdd);
    }

    const ReactLocal = require("react");

    return ReactLocal.createElement(
      "div",
      null,
      ReactLocal.createElement("h1", null, title),
      ReactLocal.createElement("button", { onClick: onAdd }, "Add item"),
      children,
      modal,
      deleteDialog
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
    onSubmit: () => void;
    closePopup: () => void;
  }) => {
    const ReactLocal = require("react");

    return ReactLocal.createElement(
      "form",
      {
        onSubmit: (event: React.FormEvent) => {
          event.preventDefault();
          onSubmit();
        },
      },
      ReactLocal.createElement("div", null, title),
      children,
      ReactLocal.createElement(
        "button",
        { type: "button", onClick: closePopup },
        "Close popup"
      ),
      ReactLocal.createElement("button", { type: "submit" }, "Submit popup")
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
            "Confirm delete"
          ),
          ReactLocal.createElement(
            "button",
            { onClick: onClose },
            "Cancel delete"
          )
        )
      : null;
  },
}));

jest.mock("@/components/albums/EditableAlbumCard", () => ({
  __esModule: true,
  default: ({
    album,
    onEdit,
    onDelete,
  }: {
    album: { title?: string };
    onEdit?: () => void;
    onDelete?: () => void;
  }) => {
    const ReactLocal = require("react");

    return ReactLocal.createElement(
      "div",
      null,
      ReactLocal.createElement("span", null, album.title),
      ReactLocal.createElement(
        "button",
        { onClick: onEdit },
        `Edit ${album.title}`
      ),
      ReactLocal.createElement(
        "button",
        { onClick: onDelete },
        `Delete ${album.title}`
      )
    );
  },
}));

const mockUseCrudPage = useCrudPage as jest.MockedFunction<typeof useCrudPage>;

const buildCrudState = (overrides: Record<string, unknown> = {}) => ({
  items: [
    {
      id: "album-1",
      title: "Spring Trip",
      desc: "Trip memories",
      date: "2024-04-01",
      type: "public",
      preview_image: "https://cdn/image.jpg",
      description: "Trip memories",
      images_count: 5,
    },
  ],
  loading: false,
  error: null,
  toggleSort: mockToggleSort,
  showPopup: false,
  formData: {},
  setFormData: mockSetFormData,
  isEditMode: false,
  openPopup: mockOpenPopup,
  closePopup: mockClosePopup,
  saveItem: mockSaveItem,
  isDeleteModalOpen: false,
  confirmDelete: mockConfirmDelete,
  closeDeleteModal: mockCloseDeleteModal,
  handleDelete: mockHandleDelete,
  ...overrides,
});

describe("pages/albums/AlbumsPage.tsx", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockOnAdd.length = 0;
  });

  test("renders album cards and wires edit/delete actions through the CRUD hook", () => {
    mockUseCrudPage.mockReturnValue(buildCrudState() as never);

    render(React.createElement(AlbumsPage));

    expect(screen.getByText("Album Management")).toBeInTheDocument();
    expect(screen.getByText("Spring Trip")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Edit Spring Trip"));
    expect(mockOpenPopup).toHaveBeenCalledWith(
      expect.objectContaining({ id: "album-1", title: "Spring Trip" })
    );

    fireEvent.click(screen.getByText("Delete Spring Trip"));
    expect(mockConfirmDelete).toHaveBeenCalledWith("album-1");
  });

  test("opens the add flow through the page layout callback", () => {
    mockUseCrudPage.mockReturnValue(buildCrudState() as never);

    render(React.createElement(AlbumsPage));
    fireEvent.click(screen.getByText("Add item"));

    expect(mockOpenPopup).toHaveBeenCalledWith();
  });

  test("renders the album popup form in create mode and updates fields", () => {
    mockUseCrudPage.mockReturnValue(
      buildCrudState({
        showPopup: true,
        formData: {
          title: "Old title",
          desc: "Old desc",
          date: "2024-01-01",
          type: "private",
          preview_image: "https://cdn/preview.jpg",
        },
      }) as never
    );

    render(React.createElement(AlbumsPage));

    expect(screen.getByText("Add Album")).toBeInTheDocument();

    fireEvent.change(screen.getByDisplayValue("Old title"), {
      target: { value: "New title" },
    });
    expect(mockSetFormData).toHaveBeenCalledWith(
      expect.objectContaining({ title: "New title" })
    );

    fireEvent.change(screen.getByDisplayValue("private"), {
      target: { value: "public" },
    });
    expect(mockSetFormData).toHaveBeenCalledWith(
      expect.objectContaining({ type: "public" })
    );

    fireEvent.click(screen.getByText("Clear"));
    expect(mockSetFormData).toHaveBeenCalledWith(
      expect.objectContaining({ preview_image: "" })
    );

    fireEvent.submit(
      screen.getByText("Submit popup").closest("form") as HTMLFormElement
    );
    expect(mockSaveItem).toHaveBeenCalled();
  });

  test("renders the popup title in edit mode and delete confirmation when open", () => {
    mockUseCrudPage.mockReturnValue(
      buildCrudState({
        showPopup: true,
        isEditMode: true,
        isDeleteModalOpen: true,
      }) as never
    );

    render(React.createElement(AlbumsPage));

    expect(screen.getByText("Edit Album")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Confirm delete"));
    expect(mockHandleDelete).toHaveBeenCalled();

    fireEvent.click(screen.getByText("Cancel delete"));
    expect(mockCloseDeleteModal).toHaveBeenCalled();
  });
});
