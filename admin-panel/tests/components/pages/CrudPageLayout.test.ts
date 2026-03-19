import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import CrudPageLayout from "@/components/pages/CrudPageLayout";
import { useNavigate } from "react-router-dom";

const mockNavigate = jest.fn();
const mockToggleSort = jest.fn();
const mockOnAdd = jest.fn();
const mockCreateElement = React.createElement;

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));
jest.mock("@/components/layout/Header", () => ({
  __esModule: true,
  default: ({ text }: { text: string }) => mockCreateElement("div", null, text),
}));
jest.mock("@/components/pages/PageState", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) =>
    mockCreateElement("div", null, children),
}));

describe("components/pages/CrudPageLayout.tsx", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  test("renders header, children, and optional chrome", () => {
    render(
      mockCreateElement(
        CrudPageLayout,
        {
          title: "Projects",
          isEmpty: false,
          loading: false,
          error: null,
          toggleSort: mockToggleSort,
          onAdd: mockOnAdd,
          showAddButton: true,
          topContent: mockCreateElement("div", null, "Top content"),
          afterHeader: mockCreateElement("div", null, "After header"),
          modal: mockCreateElement("div", null, "Modal content"),
          deleteDialog: mockCreateElement("div", null, "Delete dialog"),
          children: mockCreateElement("div", null, "Page body"),
        },
      )
    );

    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("Top content")).toBeInTheDocument();
    expect(screen.getByText("After header")).toBeInTheDocument();
    expect(screen.getByText("Page body")).toBeInTheDocument();
    expect(screen.getByText("Modal content")).toBeInTheDocument();
    expect(screen.getByText("Delete dialog")).toBeInTheDocument();
  });

  test("wires back, sort, and add actions", () => {
    render(
      mockCreateElement(
        CrudPageLayout,
        {
          title: "Projects",
          isEmpty: false,
          loading: false,
          error: null,
          toggleSort: mockToggleSort,
          onAdd: mockOnAdd,
          showAddButton: true,
          children: mockCreateElement("div", null, "Page body"),
        },
      )
    );

    fireEvent.click(screen.getByText("Back"));
    expect(mockNavigate).toHaveBeenCalledWith(-1);

    fireEvent.click(screen.getByText("Sort"));
    expect(mockToggleSort).toHaveBeenCalled();

    fireEvent.click(screen.getByText("Add New"));
    expect(mockOnAdd).toHaveBeenCalled();
  });
});
