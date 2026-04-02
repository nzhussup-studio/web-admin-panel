import React from "react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import CvGeneratorPage from "@/pages/cv/CvGeneratorPage";
import {
  CertificateControllerService,
  EducationControllerService,
  ProjectControllerService,
  SkillControllerService,
  WorkExperienceControllerService,
} from "@/lib/api/client";
import { generateCV, previewCV } from "@/lib/cv/generateCv";
import {
  loadCvGeneratorPreferences,
  saveCvGeneratorPreferences,
} from "@/lib/cv/cvGeneratorPreferences";
import { useNavigate } from "react-router-dom";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));
jest.mock("@/lib/cv/generateCv", () => ({
  generateCV: jest.fn(),
  previewCV: jest.fn(),
}));
jest.mock("@/lib/cv/cvGeneratorPreferences", () => ({
  loadCvGeneratorPreferences: jest.fn(),
  saveCvGeneratorPreferences: jest.fn(),
}));
jest.mock("@/lib/api/client", () => ({
  WorkExperienceControllerService: { listWorkExperience: jest.fn() },
  EducationControllerService: { listEducation: jest.fn() },
  SkillControllerService: { listSkill: jest.fn() },
  ProjectControllerService: { listProject: jest.fn() },
  CertificateControllerService: { listCertificate: jest.fn() },
}));
jest.mock("@/components/layout/Header", () => ({
  __esModule: true,
  default: ({ text }: any) => {
    const ReactLocal = require("react");
    return ReactLocal.createElement("div", null, `Header: ${text}`);
  },
}));
jest.mock("@/components/layout/GlobalAlert", () => ({
  __esModule: true,
  default: ({ show, message }: any) => {
    const ReactLocal = require("react");
    return show ? ReactLocal.createElement("div", null, message) : null;
  },
}));
jest.mock("@/components/shared/ConfirmDialog", () => ({
  __esModule: true,
  default: ({
    isOpen,
    title,
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    onClose,
    onConfirm,
  }: any) => {
    if (!isOpen) {
      return null;
    }

    const ReactLocal = require("react");
    return ReactLocal.createElement(
      "div",
      { "data-testid": "confirm-dialog" },
      ReactLocal.createElement("div", null, title),
      ReactLocal.createElement("div", null, message),
      ReactLocal.createElement("button", { onClick: onClose }, cancelLabel),
      ReactLocal.createElement("button", { onClick: onConfirm }, confirmLabel),
    );
  },
}));

describe("pages/cv/CvGeneratorPage.tsx", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (loadCvGeneratorPreferences as jest.Mock).mockResolvedValue(null);
    (saveCvGeneratorPreferences as jest.Mock).mockResolvedValue(undefined);
    (WorkExperienceControllerService.listWorkExperience as jest.Mock).mockResolvedValue([
      { id: 1, displayOrder: 1, position: "Engineer" },
    ]);
    (EducationControllerService.listEducation as jest.Mock).mockResolvedValue([
      { id: 2, displayOrder: 1, degree: "MSc" },
    ]);
    (SkillControllerService.listSkill as jest.Mock).mockResolvedValue([
      {
        id: 3,
        displayOrder: 1,
        category: "Languages",
        skillNames: "React, TypeScript, Node.js",
      },
    ]);
    (ProjectControllerService.listProject as jest.Mock).mockResolvedValue([
      { id: 4, displayOrder: 1, name: "Portfolio" },
    ]);
    (CertificateControllerService.listCertificate as jest.Mock).mockResolvedValue([
      { id: 5, displayOrder: 1, name: "AWS SA" },
    ]);
  });

  test("fetches all CV sections and renders basic information fields", async () => {
    render(React.createElement(CvGeneratorPage));

    await waitFor(() =>
      expect(WorkExperienceControllerService.listWorkExperience).toHaveBeenCalled()
    );
    expect(screen.getByText("Header: CV Generator")).toBeInTheDocument();
    expect(
      await screen.findByDisplayValue("Nurzhanat Zhussup")
    ).toBeInTheDocument();
    expect(screen.getByText("work experience")).toBeInTheDocument();
    expect(screen.getByText("education")).toBeInTheDocument();
  });

  test("renders structured item content instead of raw json", async () => {
    (WorkExperienceControllerService.listWorkExperience as jest.Mock).mockResolvedValue([
      {
        id: 1,
        displayOrder: 1,
        position: "Senior Backend Engineer",
        company: "Nzhussup Studio",
        location: "Passau, Germany",
        responsibilities: "Built auth and infrastructure services.",
      },
    ]);

    render(React.createElement(CvGeneratorPage));

    expect(
      await screen.findByText("Senior Backend Engineer", { selector: ".fw-semibold" })
    ).toBeInTheDocument();
    expect(screen.getByText("Nzhussup Studio • Passau, Germany")).toBeInTheDocument();
    expect(
      screen.getByText("Built auth and infrastructure services.")
    ).toBeInTheDocument();
    expect(screen.getAllByText("Available").length).toBeGreaterThan(0);
    expect(screen.queryByText(/"position":/)).not.toBeInTheDocument();
  });

  test("navigates back and refetches on sort", async () => {
    render(React.createElement(CvGeneratorPage));
    await waitFor(() =>
      expect(WorkExperienceControllerService.listWorkExperience).toHaveBeenCalledTimes(1)
    );

    fireEvent.click(screen.getByText("Back"));
    expect(mockNavigate).toHaveBeenCalledWith(-1);

    fireEvent.click(screen.getByText("Sort"));
    await waitFor(() =>
      expect(WorkExperienceControllerService.listWorkExperience).toHaveBeenCalledTimes(2)
    );
  });

  test("selects items and exports selected data to pdf", async () => {
    render(React.createElement(CvGeneratorPage));
    await waitFor(() => expect(screen.getByText("work experience")).toBeInTheDocument());

    fireEvent.click(screen.getAllByRole("checkbox")[0]);
    fireEvent.click(screen.getByText("Export to PDF"));

    expect(generateCV).toHaveBeenCalledWith(
      expect.objectContaining({
        basic_info: expect.objectContaining({ name: "Nurzhanat Zhussup" }),
        work_experience: [expect.objectContaining({ id: 1 })],
      }),
      "pdf"
    );
  });

  test("stores selection state in localStorage", async () => {
    render(React.createElement(CvGeneratorPage));
    await waitFor(() => expect(screen.getAllByRole("checkbox")[0]).toBeInTheDocument());

    fireEvent.click(screen.getAllByRole("checkbox")[0]);

    await waitFor(() => {
      const saved = JSON.parse(
        localStorage.getItem("cvGeneratorSelectedItems") || "{}"
      );
      expect(saved.selectedItems.work_experience).toEqual([1]);
    });
  });

  test("updates the availability badge after selecting an item", async () => {
    render(React.createElement(CvGeneratorPage));
    await waitFor(() => expect(screen.getAllByRole("checkbox")[0]).toBeInTheDocument());

    fireEvent.click(screen.getAllByRole("checkbox")[0]);

    expect(screen.getAllByText("Selected").length).toBeGreaterThan(0);
  });

  test("previews selected CV data", async () => {
    render(React.createElement(CvGeneratorPage));
    await waitFor(() => expect(screen.getByText("work experience")).toBeInTheDocument());

    fireEvent.click(screen.getAllByRole("checkbox")[0]);
    fireEvent.click(screen.getByText("Preview"));

    expect(previewCV).toHaveBeenCalledWith(
      expect.objectContaining({
        basic_info: expect.objectContaining({ name: "Nurzhanat Zhussup" }),
        work_experience: [expect.objectContaining({ id: 1 })],
      })
    );
  });

  test("exports only selected skill entries from a selected skills category", async () => {
    render(React.createElement(CvGeneratorPage));
    await waitFor(() => expect(screen.getByText("skills")).toBeInTheDocument());

    const skillsCard = screen.getByText("skills").closest(".card");
    expect(skillsCard).not.toBeNull();
    fireEvent.click(within(skillsCard as HTMLElement).getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: "TypeScript" }));
    fireEvent.click(screen.getByText("Export to PDF"));

    expect(generateCV).toHaveBeenCalledWith(
      expect.objectContaining({
        skills: [
          expect.objectContaining({
            id: 3,
            category: "Languages",
            skillNames: "React, Node.js",
          }),
        ],
      }),
      "pdf"
    );
  });

  test("exports project override as project purpose", async () => {
    (ProjectControllerService.listProject as jest.Mock).mockResolvedValue([
      { id: 4, displayOrder: 1, name: "Portfolio", techStack: "React" },
    ]);

    render(React.createElement(CvGeneratorPage));
    await waitFor(() => expect(screen.getByText("projects")).toBeInTheDocument());

    const projectsCard = screen.getByText("projects").closest(".card");
    expect(projectsCard).not.toBeNull();
    fireEvent.click(within(projectsCard as HTMLElement).getByRole("checkbox"));
    fireEvent.change(
      screen.getByPlaceholderText(
        "Type additional project description (optional)...",
      ),
      { target: { value: "Validate cloud platform concept quickly." } },
    );

    fireEvent.click(screen.getByText("Export to PDF"));

    expect(generateCV).toHaveBeenCalledWith(
      expect.objectContaining({
        projects: [
          expect.objectContaining({
            id: 4,
            purpose: "Validate cloud platform concept quickly.",
          }),
        ],
      }),
      "pdf",
    );
  });

  test("syncs local preferences to backend when Sync button is clicked", async () => {
    render(React.createElement(CvGeneratorPage));
    await waitFor(() => expect(screen.getByText("work experience")).toBeInTheDocument());

    fireEvent.change(screen.getByDisplayValue("Nurzhanat Zhussup"), {
      target: { value: "Updated Name" },
    });
    fireEvent.click(screen.getByText("Sync"));
    fireEvent.click(screen.getByText("To Backend"));
    fireEvent.click(screen.getByRole("button", { name: "Sync To Backend" }));

    await waitFor(() =>
      expect(saveCvGeneratorPreferences).toHaveBeenCalledWith(
        expect.objectContaining({
          basicInfo: expect.objectContaining({ name: "Updated Name" }),
        }),
      ),
    );
  });

  test("loads preferences from backend when From Backend is clicked", async () => {
    (loadCvGeneratorPreferences as jest.Mock).mockResolvedValue({
      basicInfo: { name: "Remote Name" },
    });

    render(React.createElement(CvGeneratorPage));
    await waitFor(() => expect(screen.getByText("work experience")).toBeInTheDocument());

    fireEvent.click(screen.getByText("Sync"));
    fireEvent.click(screen.getByText("From Backend"));
    fireEvent.click(screen.getByRole("button", { name: "Load From Backend" }));

    await waitFor(() =>
      expect(screen.getByDisplayValue("Remote Name")).toBeInTheDocument(),
    );
  });

  test("shows alert when backend has no saved preferences", async () => {
    (loadCvGeneratorPreferences as jest.Mock).mockResolvedValue(null);

    render(React.createElement(CvGeneratorPage));
    await waitFor(() => expect(screen.getByText("work experience")).toBeInTheDocument());

    fireEvent.click(screen.getByText("Sync"));
    fireEvent.click(screen.getByText("From Backend"));
    fireEvent.click(screen.getByRole("button", { name: "Load From Backend" }));

    expect(await screen.findByText("No backend preferences found.")).toBeInTheDocument();
  });

  test("shows alert when syncing preferences to backend fails", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    (saveCvGeneratorPreferences as jest.Mock).mockRejectedValue(new Error("sync failed"));

    render(React.createElement(CvGeneratorPage));
    await waitFor(() => expect(screen.getByText("work experience")).toBeInTheDocument());

    fireEvent.click(screen.getByText("Sync"));
    fireEvent.click(screen.getByText("To Backend"));
    fireEvent.click(screen.getByRole("button", { name: "Sync To Backend" }));

    expect(await screen.findByText("Failed to sync preferences.")).toBeInTheDocument();
    consoleErrorSpy.mockRestore();
  });

  test("shows alert when loading preferences from backend fails", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    (loadCvGeneratorPreferences as jest.Mock).mockRejectedValue(new Error("load failed"));

    render(React.createElement(CvGeneratorPage));
    await waitFor(() => expect(screen.getByText("work experience")).toBeInTheDocument());

    fireEvent.click(screen.getByText("Sync"));
    fireEvent.click(screen.getByText("From Backend"));
    fireEvent.click(screen.getByRole("button", { name: "Load From Backend" }));

    expect(
      await screen.findByText("Failed to load preferences from backend."),
    ).toBeInTheDocument();
    consoleErrorSpy.mockRestore();
  });

  test("uses custom description override in export payload without backend writes", async () => {
    (WorkExperienceControllerService.listWorkExperience as jest.Mock).mockResolvedValue([
      {
        id: 1,
        displayOrder: 1,
        position: "Engineer",
        description: "Original backend description",
      },
    ]);

    render(React.createElement(CvGeneratorPage));
    await waitFor(() => expect(screen.getByText("work experience")).toBeInTheDocument());

    fireEvent.click(screen.getAllByRole("checkbox")[0]);
    fireEvent.change(
      screen.getByPlaceholderText(/Current:/),
      { target: { value: "Compressed custom version" } }
    );
    fireEvent.click(screen.getByText("Export to PDF"));

    expect(generateCV).toHaveBeenCalledWith(
      expect.objectContaining({
        work_experience: [
          expect.objectContaining({
            id: 1,
            description: "Compressed custom version",
          }),
        ],
      }),
      "pdf"
    );
    expect(WorkExperienceControllerService.listWorkExperience).toHaveBeenCalledTimes(1);
  });

  test("clear overrides button is disabled with no overrides and enabled when overrides exist", async () => {
    (WorkExperienceControllerService.listWorkExperience as jest.Mock).mockResolvedValue([
      {
        id: 1,
        displayOrder: 1,
        position: "Engineer",
        description: "Backend description exists",
      },
    ]);

    render(React.createElement(CvGeneratorPage));
    await waitFor(() => expect(screen.getByText("work experience")).toBeInTheDocument());

    expect(screen.getByText("Clear Overrides")).toBeDisabled();

    fireEvent.click(screen.getAllByRole("checkbox")[0]);
    fireEvent.change(await screen.findByPlaceholderText(/Current:/), {
      target: { value: "Short custom text" },
    });

    await waitFor(() => expect(screen.getByText("Clear Overrides")).toBeEnabled());

    fireEvent.click(screen.getByText("Clear Overrides"));
    fireEvent.click(screen.getByText("Clear"));
    await waitFor(() => expect(screen.getByText("Clear Overrides")).toBeDisabled());
  });

  test("persists description overrides in localStorage and restores after remount", async () => {
    (WorkExperienceControllerService.listWorkExperience as jest.Mock).mockResolvedValue([
      {
        id: 1,
        displayOrder: 1,
        position: "Engineer",
        description: "Backend description exists",
      },
    ]);

    const { unmount } = render(React.createElement(CvGeneratorPage));
    await waitFor(() => expect(screen.getByText("work experience")).toBeInTheDocument());

    fireEvent.click(screen.getAllByRole("checkbox")[0]);
    fireEvent.change(await screen.findByPlaceholderText(/Current:/), {
      target: { value: "Persistent override text" },
    });

    await waitFor(() => {
      const saved = JSON.parse(
        localStorage.getItem("cvGeneratorSelectedItems") || "{}"
      );
      expect(saved.descriptionOverrides["work_experience:1"]).toBe(
        "Persistent override text"
      );
    });

    unmount();
    render(React.createElement(CvGeneratorPage));
    await waitFor(() => expect(screen.getByText("work experience")).toBeInTheDocument());
    await waitFor(() =>
      expect(screen.getByDisplayValue("Persistent override text")).toBeInTheDocument()
    );
  });
});
