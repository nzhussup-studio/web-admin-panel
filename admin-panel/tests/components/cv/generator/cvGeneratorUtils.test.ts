import {
  applyDescriptionOverride,
  canOverrideDescription,
  getLongDescription,
  parseSkillNames,
} from "@/components/cv/generator/cvGeneratorUtils";

describe("components/cv/generator/cvGeneratorUtils.ts", () => {
  test("parseSkillNames splits by comma, semicolon and newline and deduplicates", () => {
    expect(parseSkillNames("React, TypeScript; React\nNode.js")).toEqual([
      "React",
      "TypeScript",
      "Node.js",
    ]);
  });

  test("getLongDescription returns first available long text field", () => {
    expect(
      getLongDescription({
        title: "Role",
        responsibilities: "Own backend delivery",
        description: "Fallback description",
      }),
    ).toBe("Fallback description");
  });

  test("canOverrideDescription is true only when description-like text exists", () => {
    expect(canOverrideDescription({ details: "Something long" })).toBe(true);
    expect(canOverrideDescription({ title: "No long text" })).toBe(false);
  });

  test("applyDescriptionOverride updates existing long text field", () => {
    const updated = applyDescriptionOverride(
      { description: "Old text", title: "Engineer" },
      "New compact text",
    );

    expect(updated).toEqual({
      description: "New compact text",
      title: "Engineer",
    });
  });

  test("applyDescriptionOverride creates description when no long text field exists", () => {
    const updated = applyDescriptionOverride(
      { title: "Engineer" },
      "Generated summary",
    );

    expect(updated).toEqual({
      title: "Engineer",
      description: "Generated summary",
    });
  });
});
