import React from "react";
import { render, screen } from "@testing-library/react";
import CvTemplate from "@/components/cv/CvTemplate";

const h = React.createElement;

describe("components/cv/CvTemplate.tsx", () => {
  test("renders all provided CV sections and basic info", () => {
    render(
      h(CvTemplate, {
        data: {
          basic_info: {
            name: "Nurzhanat Zhussup",
            email: "user@test.com",
            website: "https://nzhussup.dev",
            github: "https://github.com/nzhussup",
            linkedin: "https://linkedin.test/profile",
            about: "Backend engineer",
          },
          work_experience: [
            {
              id: 1,
              displayOrder: 1,
              position: "Engineer",
              company: "Acme",
              location: "Vienna",
              startDate: "2022",
              endDate: "",
              description: "Built APIs",
              techStack: "Go, AWS",
            },
          ],
          education: [
            {
              id: 2,
              displayOrder: 1,
              degree: "MSc",
              institution: "TU Wien",
              location: "Vienna",
              startDate: "2020-01-01",
              endDate: "2022-01-01",
              description: "Computer Science",
              thesis: "AI Systems",
            },
          ],
          skills: [
            {
              id: 3,
              displayOrder: 1,
              category: "Languages",
              skillNames: "TypeScript, Go",
            },
          ],
          projects: [
            {
              id: 4,
              displayOrder: 1,
              name: "Portfolio",
              url: "https://project.test",
              techStack: "React",
            },
          ],
          certificates: [
            {
              id: 5,
              displayOrder: 1,
              name: "AWS SA",
              url: "https://cert.test",
            },
          ],
        },
      }),
    );

    expect(screen.getByText("Nurzhanat Zhussup")).toBeInTheDocument();
    expect(screen.getByText("Work Experience")).toBeInTheDocument();
    expect(screen.getByText("Education")).toBeInTheDocument();
    expect(screen.getByText("Skills")).toBeInTheDocument();
    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("Certificates")).toBeInTheDocument();
    expect(screen.getAllByText(/Tech Stack:/)).toHaveLength(2);
  });

  test("sorts ordered sections descending by display order", () => {
    render(
      h(CvTemplate, {
        data: {
          basic_info: {},
          skills: [
            { id: 1, displayOrder: 1, category: "Later", skillNames: "One" },
            { id: 2, displayOrder: 10, category: "Earlier", skillNames: "Two" },
          ],
        },
      }),
    );

    const skillSection =
      screen.getByText("Skills").parentElement?.textContent || "";
    expect(skillSection.indexOf("Earlier:")).toBeLessThan(
      skillSection.indexOf("Later:"),
    );
  });
});
