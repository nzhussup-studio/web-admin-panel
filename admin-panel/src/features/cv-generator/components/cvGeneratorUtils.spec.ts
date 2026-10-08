import { describe, expect, it } from "vitest";
import {
  applyDescriptionOverride,
  buildOverrideKey,
  canOverrideDescription,
  formatLabel,
  formatScalar,
  getItemSubtitle,
  getItemTitle,
  getMetadataEntries,
  parseSkillNames,
  parseTechStack,
} from "./cvGeneratorUtils";

describe("cvGeneratorUtils", () => {
  it("formats labels and scalar values", () => {
    expect(formatLabel("displayOrder")).toBe("Display Order");
    expect(formatLabel("work_experience")).toBe("Work Experience");
    expect(formatScalar(["React", null, "Go"])).toBe("React, Go");
    expect(formatScalar({ nested: true })).toBe("");
  });

  it("extracts titles and unique subtitles", () => {
    expect(getItemTitle({ position: "Engineer" }, "Fallback")).toBe("Engineer");
    expect(getItemTitle({}, "Fallback")).toBe("Fallback");
    expect(
      getItemSubtitle({
        company: "NZ",
        organization: "NZ",
        location: "Vienna",
      }),
    ).toBe("NZ • Vienna");
  });

  it("parses and de-duplicates delimited entries", () => {
    expect(parseSkillNames("React, Go; React\nTypeScript")).toEqual([
      "React",
      "Go",
      "TypeScript",
    ]);
    expect(parseTechStack(["Docker", "Kubernetes"])).toEqual([
      "Docker",
      "Kubernetes",
    ]);
  });

  it("applies description overrides without mutating the source", () => {
    const source = { title: "Role", summary: "Old" };
    expect(applyDescriptionOverride(source, "  New summary ")).toEqual({
      title: "Role",
      summary: "New summary",
    });
    expect(source.summary).toBe("Old");
    expect(applyDescriptionOverride(source, " ")).toBe(source);
    expect(canOverrideDescription(source)).toBe(true);
    expect(buildOverrideKey("work", 7)).toBe("work:7");
  });

  it("returns only useful metadata", () => {
    expect(
      getMetadataEntries({
        id: 1,
        title: "Role",
        description: "Text",
        startDate: "2024",
      }),
    ).toEqual([{ label: "Start Date", value: "2024" }]);
  });
});
