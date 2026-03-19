import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import CvPage from "@/pages/cv/CvPage";
import { useNavigate } from "react-router-dom";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

jest.mock("@/components/layout/Header", () => ({
  __esModule: true,
  default: ({ text }: { text: string }) => {
    const ReactLocal = require("react");
    return ReactLocal.createElement("div", null, `Header: ${text}`);
  },
}));

describe("pages/cv/CvPage.tsx", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  test("renders the cv management sections", () => {
    render(React.createElement(CvPage));

    expect(screen.getByText("Header: CV Management")).toBeInTheDocument();
    expect(screen.getByText("Work Experience")).toBeInTheDocument();
    expect(screen.getByText("Education")).toBeInTheDocument();
    expect(screen.getByText("Skills")).toBeInTheDocument();
    expect(screen.getByText("Certifications")).toBeInTheDocument();
  });

  test("navigates back and to a selected cv section", () => {
    render(React.createElement(CvPage));

    fireEvent.click(screen.getByText("Back"));
    expect(mockNavigate).toHaveBeenCalledWith(-1);

    fireEvent.click(screen.getByText("Education"));
    expect(mockNavigate).toHaveBeenCalledWith("/cv/education");
  });
});
