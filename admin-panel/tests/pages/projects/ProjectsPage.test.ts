import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import ProjectsPage from "@/pages/projects/ProjectsPage";
import { useCrudPage } from "@/hooks/crud/useCrudPage";

const mockOpenPopup = jest.fn();
const mockSaveItem = jest.fn();
const mockConfirmDelete = jest.fn();
const mockHandleDelete = jest.fn();
const mockSetFormData = jest.fn();

jest.mock("@/hooks/crud/useCrudPage", () => ({
  useCrudPage: jest.fn(),
}));
jest.mock("@/components/pages/CrudPageLayout", () => ({
  __esModule: true,
  default: ({ title, onAdd, children, modal, deleteDialog }: any) => {
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
  default: ({ title, children, onSubmit }: any) => {
    const ReactLocal = require("react");
    return ReactLocal.createElement(
      "form",
      { onSubmit: (e: React.FormEvent) => (e.preventDefault(), onSubmit()) },
      ReactLocal.createElement("div", null, title),
      children,
      ReactLocal.createElement("button", { type: "submit" }, "Submit popup")
    );
  },
}));
jest.mock("@/components/shared/ConfirmDialog", () => ({
  __esModule: true,
  default: ({ isOpen, onConfirm }: any) => {
    const ReactLocal = require("react");
    return isOpen
      ? ReactLocal.createElement("button", { onClick: onConfirm }, "Confirm delete")
      : null;
  },
}));

const mockUseCrudPage = useCrudPage as jest.MockedFunction<typeof useCrudPage>;
const buildState = (overrides: Record<string, unknown> = {}) =>
  ({
    items: [
      {
        id: 1,
        name: "Portfolio",
        techStack: "React, TypeScript",
        url: "https://example.com",
        displayOrder: 1,
      },
    ],
    loading: false,
    error: null,
    toggleSort: jest.fn(),
    showPopup: false,
    formData: {},
    setFormData: mockSetFormData,
    isEditMode: false,
    openPopup: mockOpenPopup,
    closePopup: jest.fn(),
    saveItem: mockSaveItem,
    isDeleteModalOpen: false,
    confirmDelete: mockConfirmDelete,
    closeDeleteModal: jest.fn(),
    handleDelete: mockHandleDelete,
    ...overrides,
  }) as never;

describe("pages/projects/ProjectsPage.tsx", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the project card and opens edit mode on card click", () => {
    mockUseCrudPage.mockReturnValue(buildState());
    render(React.createElement(ProjectsPage));

    fireEvent.click(screen.getByText("Portfolio"));
    expect(mockOpenPopup).toHaveBeenCalledWith(
      expect.objectContaining({ id: 1, name: "Portfolio" })
    );
    expect(screen.getByText("View Project")).toBeInTheDocument();
  });

  test("renders the popup form and submits updates", () => {
    mockUseCrudPage.mockReturnValue(
      buildState({
        showPopup: true,
        formData: {
          name: "Old name",
          techStack: "React",
          url: "https://old.test",
          displayOrder: 1,
        },
      })
    );

    render(React.createElement(ProjectsPage));
    fireEvent.change(screen.getByDisplayValue("Old name"), {
      target: { value: "New name" },
    });
    expect(mockSetFormData).toHaveBeenCalledWith(
      expect.objectContaining({ name: "New name" })
    );
    fireEvent.submit(screen.getByText("Submit popup").closest("form") as HTMLFormElement);
    expect(mockSaveItem).toHaveBeenCalled();
  });

  test("confirms deletion from the delete action", () => {
    mockUseCrudPage.mockReturnValue(buildState({ isDeleteModalOpen: true }));
    render(React.createElement(ProjectsPage));

    fireEvent.click(screen.getByText("Delete"));
    expect(mockConfirmDelete).toHaveBeenCalledWith(1);
    fireEvent.click(screen.getByText("Confirm delete"));
    expect(mockHandleDelete).toHaveBeenCalled();
  });
});
