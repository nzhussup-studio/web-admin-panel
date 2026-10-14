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
  parseCustomSkillsText,
  serializeCustomSkillCategories,
  sortCvItemsLatestFirst,
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

  it("parses and serializes the custom skills text format", () => {
    const categories = parseCustomSkillsText(
      "Languages: Java, Go, Java\nPlatform & Cloud: AWS; Terraform\nIncomplete line",
    );

    expect(categories).toEqual([
      {
        id: "custom-skill-category-0",
        name: "Languages",
        skills: ["Java", "Go"],
      },
      {
        id: "custom-skill-category-1",
        name: "Platform & Cloud",
        skills: ["AWS", "Terraform"],
      },
    ]);
    expect(serializeCustomSkillCategories(categories)).toBe(
      "Languages: Java, Go\nPlatform & Cloud: AWS, Terraform",
    );
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

  it("sorts entries newest first and falls back to descending display order", () => {
    expect(
      sortCvItemsLatestFirst([
        { id: "older", startDate: "2022-01-01", displayOrder: 99 },
        { id: "newer", startDate: "2025-03-01", displayOrder: 1 },
        { id: "undated", displayOrder: 100 },
      ]).map((item) => item.id),
    ).toEqual(["newer", "older", "undated"]);

    expect(
      sortCvItemsLatestFirst([
        { id: "second", displayOrder: 2 },
        { id: "first", displayOrder: 7 },
      ]).map((item) => item.id),
    ).toEqual(["first", "second"]);
  });
});
