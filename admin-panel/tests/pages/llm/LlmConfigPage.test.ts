import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import LlmConfigPage from "@/pages/llm/LlmConfigPage";

const mockConsoleLog = jest.spyOn(console, "log").mockImplementation(() => {});

jest.mock("@/components/layout/Header", () => ({
  __esModule: true,
  default: ({ text }: { text: string }) => {
    const ReactLocal = require("react");
    return ReactLocal.createElement("div", null, `Header: ${text}`);
  },
}));

describe("pages/llm/LlmConfigPage.tsx", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    mockConsoleLog.mockRestore();
  });

  test("renders the config form", () => {
    render(React.createElement(LlmConfigPage));

    expect(screen.getByText("Header: LLM Configuration")).toBeInTheDocument();
    expect(screen.getByLabelText("Model Name")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Enable Background Generation")
    ).toBeInTheDocument();
  });

  test("updates values and logs the submitted configuration", () => {
    render(React.createElement(LlmConfigPage));

    fireEvent.change(screen.getByLabelText("Model Name"), {
      target: { value: "gpt-5.4" },
    });
    fireEvent.click(screen.getByLabelText("Enable Background Generation"));
    fireEvent.click(screen.getByText("Save Configuration"));

    expect(mockConsoleLog).toHaveBeenCalledWith("Model Name:", "gpt-5.4");
    expect(mockConsoleLog).toHaveBeenCalledWith(
      "Enable Background Generation:",
      true
    );
  });
});
