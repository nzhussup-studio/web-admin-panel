import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import LlmConfigPage from "@/pages/llm/LlmConfigPage";

const mockGetConfiguration = jest.fn();
const mockPutConfiguration = jest.fn();
const mockGenerateSummary = jest.fn();
const mockTriggerAlert = jest.fn();
const mockNavigate = jest.fn();
const mockGetApiErrorMessage = jest.fn((_: unknown, prefix?: string) =>
  `${prefix || "Request failed"}: mocked error`,
);

jest.mock("@/components/layout/Header", () => ({
  __esModule: true,
  default: ({ text }: { text: string }) => {
    const ReactLocal = require("react");
    return ReactLocal.createElement("div", null, `Header: ${text}`);
  },
}));

jest.mock("@/lib/api/client", () => ({
  __esModule: true,
  ConfigurationService: {
    getV1LlmConfiguration: () => mockGetConfiguration(),
    putV1LlmConfiguration: (payload: unknown) => mockPutConfiguration(payload),
  },
  SummarizerService: {
    getV1LlmSummarize: (lang?: string) => mockGenerateSummary(lang),
  },
}));

jest.mock("@/hooks/alerts/useOptionalGlobalAlert", () => ({
  __esModule: true,
  useOptionalGlobalAlert: () => ({
    triggerAlert: mockTriggerAlert,
  }),
}));

jest.mock("@/lib/api/errors", () => ({
  __esModule: true,
  getApiErrorMessage: (error: unknown, prefix?: string) =>
    mockGetApiErrorMessage(error, prefix),
}));

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("pages/llm/LlmConfigPage.tsx", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetConfiguration.mockResolvedValue({
      model: "openai/gpt-4.1-mini",
      system_prompt_en: "EN prompt",
      system_prompt_de: "DE prompt",
      system_prompt_kz: "KZ prompt",
      enable_parallel_generation: true,
    });
    mockGenerateSummary.mockResolvedValue({
      status: 200,
      message: "Generated summary text",
    });
  });

  test("loads and renders configuration", async () => {
    render(React.createElement(LlmConfigPage));

    expect(screen.getByText("Header: LLM Configuration")).toBeInTheDocument();

    await waitFor(() =>
      expect(mockGetConfiguration).toHaveBeenCalledTimes(1),
    );

    expect(screen.getByLabelText("Model Name")).toHaveValue(
      "openai/gpt-4.1-mini",
    );
    expect(screen.getByLabelText("System Prompt (EN)")).toHaveValue("EN prompt");
    expect(screen.getByLabelText("System Prompt (DE)")).toHaveValue("DE prompt");
    expect(screen.getByLabelText("System Prompt (KZ)")).toHaveValue("KZ prompt");
    expect(screen.getByLabelText("Enable Background Generation")).toBeChecked();
  });

  test("saves updated configuration", async () => {
    mockPutConfiguration.mockResolvedValue({
      model: "openai/gpt-5.4",
      system_prompt_en: "Updated EN",
      system_prompt_de: "Updated DE",
      system_prompt_kz: "Updated KZ",
      enable_parallel_generation: false,
    });

    render(React.createElement(LlmConfigPage));

    await waitFor(() =>
      expect(mockGetConfiguration).toHaveBeenCalledTimes(1),
    );

    fireEvent.change(screen.getByLabelText("Model Name"), {
      target: { value: "openai/gpt-5.4" },
    });
    fireEvent.click(screen.getByLabelText("Enable Background Generation"));
    fireEvent.click(screen.getByRole("button", { name: "Save Configuration" }));

    await waitFor(() =>
      expect(mockPutConfiguration).toHaveBeenCalledWith({
        model: "openai/gpt-5.4",
        system_prompt_en: "EN prompt",
        system_prompt_de: "DE prompt",
        system_prompt_kz: "KZ prompt",
        enable_parallel_generation: false,
      }),
    );

    expect(mockTriggerAlert).toHaveBeenCalledWith(
      "LLM configuration saved.",
      "success",
    );
  });

  test("shows error when loading fails", async () => {
    mockGetConfiguration.mockRejectedValue(new Error("boom"));

    render(React.createElement(LlmConfigPage));

    await waitFor(() =>
      expect(screen.getByText(/Failed to load LLM configuration/)).toBeInTheDocument(),
    );
    expect(mockTriggerAlert).toHaveBeenCalledWith(
      "Failed to load LLM configuration: mocked error",
      "danger",
    );
  });

  test("generates summary for selected language", async () => {
    render(React.createElement(LlmConfigPage));

    await waitFor(() =>
      expect(mockGetConfiguration).toHaveBeenCalledTimes(1),
    );

    fireEvent.change(screen.getByLabelText("Language"), {
      target: { value: "de" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Generate Summary" }));

    await waitFor(() => expect(mockGenerateSummary).toHaveBeenCalledWith("de"));
    expect(screen.getByLabelText("Generated Summary")).toHaveValue(
      "Generated summary text",
    );
  });
});
