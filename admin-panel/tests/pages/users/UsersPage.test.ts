import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import UsersPage from "@/pages/users/UsersPage";
import { useCrudPage } from "@/hooks/crud/useCrudPage";
import { normalizeApiError } from "@/lib/api/errors";

const mockOpenPopup = jest.fn();
const mockSaveItem = jest.fn();
const mockConfirmDelete = jest.fn();
const mockHandleDeleteBase = jest.fn();
const mockSetFormData = jest.fn();
const mockSetError = jest.fn();

jest.mock("@/hooks/crud/useCrudPage", () => ({ useCrudPage: jest.fn() }));
jest.mock("@/lib/api/errors", () => ({ normalizeApiError: jest.fn() }));
jest.mock("@/components/pages/CrudPageLayout", () => ({
  __esModule: true,
  default: ({ title, onAdd, children, modal, deleteDialog, afterHeader }: any) => {
    const ReactLocal = require("react");
    return ReactLocal.createElement("div", null,
      ReactLocal.createElement("h1", null, title),
      afterHeader,
      ReactLocal.createElement("button", { onClick: onAdd }, "Add item"),
      children, modal, deleteDialog);
  },
}));
jest.mock("@/components/shared/Popup", () => ({
  __esModule: true,
  default: ({ title, children, onSubmit }: any) => {
    const ReactLocal = require("react");
    return ReactLocal.createElement("form", { onSubmit: (e: React.FormEvent) => (e.preventDefault(), onSubmit()) },
      ReactLocal.createElement("div", null, title), children,
      ReactLocal.createElement("button", { type: "submit" }, "Submit popup"));
  },
}));
jest.mock("@/components/shared/ConfirmDialog", () => ({
  __esModule: true,
  default: ({ isOpen, onConfirm }: any) => {
    const ReactLocal = require("react");
    return isOpen ? ReactLocal.createElement("button", { onClick: onConfirm }, "Confirm delete") : null;
  },
}));
jest.mock("@/components/layout/GlobalAlert", () => ({
  __esModule: true,
  default: ({ show, message }: any) => {
    const ReactLocal = require("react");
    return show ? ReactLocal.createElement("div", null, message) : null;
  },
}));

const mockUseCrudPage = useCrudPage as jest.MockedFunction<typeof useCrudPage>;
const mockNormalizeApiError = normalizeApiError as jest.MockedFunction<typeof normalizeApiError>;
const buildState = (overrides: Record<string, unknown> = {}) => ({
  items: [{ id: 1, username: "admin", password: "secret", role: "ROLE_ADMIN" }],
  loading: false, error: null, setError: mockSetError, toggleSort: jest.fn(), showPopup: false,
  formData: {}, setFormData: mockSetFormData, isEditMode: false, openPopup: mockOpenPopup,
  closePopup: jest.fn(), saveItem: mockSaveItem, isDeleteModalOpen: false,
  confirmDelete: mockConfirmDelete, closeDeleteModal: jest.fn(),
  handleDelete: mockHandleDeleteBase, ...overrides,
}) as never;

describe("pages/users/UsersPage.tsx", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders users and opens edit mode on card click", () => {
    mockUseCrudPage.mockReturnValue(buildState());
    render(React.createElement(UsersPage));
    fireEvent.click(screen.getByText("admin"));
    expect(mockOpenPopup).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
    expect(screen.getByText("ROLE_ADMIN")).toBeInTheDocument();
  });

  test("renders and submits the user form", () => {
    mockUseCrudPage.mockReturnValue(buildState({ showPopup: true, formData: { username: "old", password: "pwd", role: "ROLE_USER" } }));
    render(React.createElement(UsersPage));
    fireEvent.change(screen.getByDisplayValue("old"), { target: { value: "new-user" } });
    expect(mockSetFormData).toHaveBeenCalledWith(expect.objectContaining({ username: "new-user" }));
    fireEvent.submit(screen.getByText("Submit popup").closest("form") as HTMLFormElement);
    expect(mockSaveItem).toHaveBeenCalled();
  });

  test("shows a delete alert when the backend rejects deleting the last admin", async () => {
    mockHandleDeleteBase.mockRejectedValue(new Error("forbidden"));
    mockNormalizeApiError.mockReturnValue({ status: 403, message: "Forbidden" } as never);
    mockUseCrudPage.mockReturnValue(buildState({ isDeleteModalOpen: true }));

    render(React.createElement(UsersPage));
    fireEvent.click(screen.getByText("Confirm delete"));

    await waitFor(() =>
      expect(screen.getByText("Can't delete last admin")).toBeInTheDocument()
    );
    expect(mockSetError).toHaveBeenCalledWith(
      expect.objectContaining({ status: 403 })
    );
  });
});
