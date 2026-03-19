import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import CvGeneratorPage from "@/pages/cv/CvGeneratorPage";
import {
  CertificateControllerService,
  EducationControllerService,
  ProjectControllerService,
  SkillControllerService,
  WorkExperienceControllerService,
} from "@/lib/api/client";
import { generateCV } from "@/lib/cv/generateCv";
import { useNavigate } from "react-router-dom";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));
jest.mock("@/lib/cv/generateCv", () => ({ generateCV: jest.fn() }));
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

describe("pages/cv/CvGeneratorPage.tsx", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (WorkExperienceControllerService.listWorkExperience as jest.Mock).mockResolvedValue([
      { id: 1, displayOrder: 1, position: "Engineer" },
    ]);
    (EducationControllerService.listEducation as jest.Mock).mockResolvedValue([
      { id: 2, displayOrder: 1, degree: "MSc" },
    ]);
    (SkillControllerService.listSkill as jest.Mock).mockResolvedValue([
      { id: 3, displayOrder: 1, category: "Languages" },
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
});
