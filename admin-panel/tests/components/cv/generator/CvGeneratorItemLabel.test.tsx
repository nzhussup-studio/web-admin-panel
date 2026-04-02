import React from "react";
import { render, screen } from "@testing-library/react";
import CvGeneratorItemLabel from "@/components/cv/generator/CvGeneratorItemLabel";

describe("components/cv/generator/CvGeneratorItemLabel.tsx", () => {
  test("renders title, subtitle, metadata and description", () => {
    render(
      <CvGeneratorItemLabel
        sectionName="work_experience"
        item={{
          position: "Backend Engineer",
          company: "Tech Co",
          location: "Vienna",
          type: "Hybrid",
          description: "Built APIs",
        }}
        isChecked={true}
      />,
    );

    expect(screen.getAllByText("Backend Engineer").length).toBeGreaterThan(0);
    expect(screen.getByText("Tech Co • Vienna")).toBeInTheDocument();
    expect(screen.getByText("Built APIs")).toBeInTheDocument();
    expect(screen.getByText("Selected")).toBeInTheDocument();
    expect(screen.getByText(/Type:/)).toBeInTheDocument();
  });
});
