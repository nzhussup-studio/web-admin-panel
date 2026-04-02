import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import CvGeneratorBasicInfoCard from "@/components/cv/generator/CvGeneratorBasicInfoCard";

describe("components/cv/generator/CvGeneratorBasicInfoCard.tsx", () => {
  test("renders fields and triggers on change", () => {
    const onBasicInfoChange = jest.fn();

    render(
      <CvGeneratorBasicInfoCard
        basicInfo={{
          name: "Nurzhanat Zhussup",
          email: "john.doe@example.com",
          about: "Engineer summary",
        }}
        onBasicInfoChange={onBasicInfoChange}
      />, 
    );

    expect(screen.getByText("Basic Information")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Nurzhanat Zhussup")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Engineer summary")).toBeInTheDocument();

    fireEvent.change(screen.getByDisplayValue("john.doe@example.com"), {
      target: { value: "new@example.com" },
    });

    expect(onBasicInfoChange).toHaveBeenCalledWith("email", "new@example.com");
  });
});
