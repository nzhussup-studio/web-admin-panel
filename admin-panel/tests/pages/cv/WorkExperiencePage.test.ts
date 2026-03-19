import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import WorkExperiencePage from "@/pages/cv/WorkExperiencePage";
import { useCrudPage } from "@/hooks/crud/useCrudPage";

const mockOpenPopup = jest.fn();
const mockSaveItem = jest.fn();
const mockConfirmDelete = jest.fn();
const mockHandleDelete = jest.fn();
const mockSetFormData = jest.fn();

jest.mock("@/hooks/crud/useCrudPage", () => ({ useCrudPage: jest.fn() }));
jest.mock("@/components/pages/CrudPageLayout", () => ({
  __esModule: true,
  default: ({ title, onAdd, children, modal, deleteDialog }: any) => {
    const ReactLocal = require("react");
    return ReactLocal.createElement("div", null, ReactLocal.createElement("h1", null, title), ReactLocal.createElement("button", { onClick: onAdd }, "Add item"), children, modal, deleteDialog);
  },
}));
jest.mock("@/components/shared/Popup", () => ({
  __esModule: true,
  default: ({ title, children, onSubmit }: any) => {
    const ReactLocal = require("react");
    return ReactLocal.createElement("form", { onSubmit: (e: React.FormEvent) => (e.preventDefault(), onSubmit()) }, ReactLocal.createElement("div", null, title), children, ReactLocal.createElement("button", { type: "submit" }, "Submit popup"));
  },
}));
jest.mock("@/components/shared/ConfirmDialog", () => ({
  __esModule: true,
  default: ({ isOpen, onConfirm }: any) => {
    const ReactLocal = require("react");
    return isOpen ? ReactLocal.createElement("button", { onClick: onConfirm }, "Confirm delete") : null;
  },
}));

const mockUseCrudPage = useCrudPage as jest.MockedFunction<typeof useCrudPage>;
const buildState = (overrides: Record<string, unknown> = {}) => ({
  items: [{ id: 1, position: "Engineer", company: "Acme", location: "Vienna", startDate: "2020", endDate: "2021", description: "Built APIs", techStack: "Go, AWS", displayOrder: 1 }],
  loading: false, error: null, toggleSort: jest.fn(), showPopup: false, formData: {},
  setFormData: mockSetFormData, isEditMode: false, openPopup: mockOpenPopup, closePopup: jest.fn(),
  saveItem: mockSaveItem, isDeleteModalOpen: false, confirmDelete: mockConfirmDelete,
  closeDeleteModal: jest.fn(), handleDelete: mockHandleDelete, ...overrides,
}) as never;

describe("pages/cv/WorkExperiencePage.tsx", () => {
  beforeEach(() => jest.clearAllMocks());

  test("renders work experience and opens edit mode on card click", () => {
    mockUseCrudPage.mockReturnValue(buildState());
    render(React.createElement(WorkExperiencePage));
    fireEvent.click(screen.getByText("Engineer"));
    expect(mockOpenPopup).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
    expect(screen.getByText("Acme")).toBeInTheDocument();
  });

  test("renders and submits the work experience form", () => {
    mockUseCrudPage.mockReturnValue(buildState({ showPopup: true, formData: { position: "Old", company: "Co", location: "City", startDate: "2020", endDate: "2021", description: "Desc", techStack: "JS", displayOrder: 2 } }));
    render(React.createElement(WorkExperiencePage));
    fireEvent.change(screen.getByDisplayValue("Old"), { target: { value: "New" } });
    expect(mockSetFormData).toHaveBeenCalledWith(expect.objectContaining({ position: "New" }));
    fireEvent.submit(screen.getByText("Submit popup").closest("form") as HTMLFormElement);
    expect(mockSaveItem).toHaveBeenCalled();
  });

  test("confirms deletion", () => {
    mockUseCrudPage.mockReturnValue(buildState({ isDeleteModalOpen: true }));
    render(React.createElement(WorkExperiencePage));
    fireEvent.click(screen.getByText("Delete"));
    expect(mockConfirmDelete).toHaveBeenCalledWith(1);
    fireEvent.click(screen.getByText("Confirm delete"));
    expect(mockHandleDelete).toHaveBeenCalled();
  });
});
