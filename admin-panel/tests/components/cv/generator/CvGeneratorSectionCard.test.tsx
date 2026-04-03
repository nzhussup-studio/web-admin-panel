import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import CvGeneratorSectionCard from "@/components/cv/generator/CvGeneratorSectionCard";

const baseCallbacks = {
  onToggleAll: jest.fn(),
  onToggleItem: jest.fn(),
  onSetDescriptionOverride: jest.fn(),
  onToggleSkillCategory: jest.fn(),
  onToggleSkillEntry: jest.fn(),
  onToggleTechStackCategory: jest.fn(),
  onToggleTechStackEntry: jest.fn(),
};

describe("components/cv/generator/CvGeneratorSectionCard.tsx", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders work experience item and triggers tech stack category toggle", () => {
    render(
      <CvGeneratorSectionCard
        sectionName="work_experience"
        items={[
          {
            id: 1,
            position: "Senior Backend Engineer",
            company: "ECB Project",
            location: "Frankfurt",
            description: "Built platform services",
          },
        ]}
        selectedItems={new Set()}
        descriptionOverrides={{}}
        selectedSkillEntries={{}}
        selectedTechStackEntries={{}}
        {...baseCallbacks}
      />, 
    );

    expect(screen.getByText("work experience")).toBeInTheDocument();
    expect(screen.getAllByText("Senior Backend Engineer").length).toBeGreaterThan(
      0,
    );
    expect(screen.getByText("ECB Project • Frankfurt")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("checkbox"));
    expect(baseCallbacks.onToggleTechStackCategory).toHaveBeenCalledWith(
      "work_experience",
      1,
      [],
      false,
    );
  });

  test("shows project description input for selected project", () => {
    render(
      <CvGeneratorSectionCard
        sectionName="projects"
        items={[
          {
            id: 4,
            name: "Portfolio",
            description: "Old description",
          },
        ]}
        selectedItems={new Set([4])}
        descriptionOverrides={{ "projects:4": "Custom text" }}
        selectedSkillEntries={{}}
        selectedTechStackEntries={{}}
        {...baseCallbacks}
      />, 
    );

    expect(screen.getByText("Project description (optional)")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Current: Old description")).toBeInTheDocument();

    fireEvent.change(screen.getByDisplayValue("Custom text"), {
      target: { value: "Updated custom" },
    });

    expect(baseCallbacks.onSetDescriptionOverride).toHaveBeenCalledWith(
      "projects",
      4,
      "Updated custom",
    );
  });

  test("renders skills category with individual skills and triggers callbacks", () => {
    render(
      <CvGeneratorSectionCard
        sectionName="skills"
        items={[
          {
            id: 3,
            category: "Languages",
            skillNames: "React, TypeScript, Node.js",
          },
        ]}
        selectedItems={new Set([3])}
        descriptionOverrides={{}}
        selectedSkillEntries={{ "3": new Set(["React", "Node.js"]) }}
        selectedTechStackEntries={{}}
        {...baseCallbacks}
      />, 
    );

    expect(screen.getByText("Languages")).toBeInTheDocument();
    expect(screen.getByText("2 of 3 selected")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("checkbox"));
    expect(baseCallbacks.onToggleSkillCategory).toHaveBeenCalledWith(
      3,
      ["React", "TypeScript", "Node.js"],
      true,
    );

    fireEvent.click(screen.getByRole("button", { name: "TypeScript" }));
    expect(baseCallbacks.onToggleSkillEntry).toHaveBeenCalledWith(
      3,
      "TypeScript",
      ["React", "Node.js"],
    );
  });

  test("renders tech stack entries for work experience and triggers callbacks", () => {
    render(
      <CvGeneratorSectionCard
        sectionName="work_experience"
        items={[
          {
            id: 11,
            position: "Platform Engineer",
            company: "Acme",
            techStack: "Go, AWS, Terraform",
          },
        ]}
        selectedItems={new Set([11])}
        descriptionOverrides={{}}
        selectedSkillEntries={{}}
        selectedTechStackEntries={{
          "work_experience:11": new Set(["Go", "AWS"]),
        }}
        {...baseCallbacks}
      />,
    );

    expect(
      screen.getByText("2 of 3 tech stack entries selected"),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("checkbox"));
    expect(baseCallbacks.onToggleTechStackCategory).toHaveBeenCalledWith(
      "work_experience",
      11,
      ["Go", "AWS", "Terraform"],
      true,
    );

    fireEvent.click(screen.getByRole("button", { name: "Terraform" }));
    expect(baseCallbacks.onToggleTechStackEntry).toHaveBeenCalledWith(
      "work_experience",
      11,
      "Terraform",
      ["Go", "AWS"],
    );
  });
});
