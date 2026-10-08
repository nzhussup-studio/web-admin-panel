import { describe, expect, it } from "vitest";
import { sortProjects, toProjectPayload } from "./projectData";

describe("projectData", () => {
  const projects = [
    { id: 1, name: "First", displayOrder: 2 },
    { id: 2, name: "Second", displayOrder: 1 },
  ];

  it("sorts projects in both directions", () => {
    expect(sortProjects([...projects], true).map(({ id }) => id)).toEqual([
      2, 1,
    ]);
    expect(sortProjects([...projects], false).map(({ id }) => id)).toEqual([
      1, 2,
    ]);
  });

  it("normalizes display order to a number", () => {
    expect(
      toProjectPayload({ name: "Site", displayOrder: "4" as never })
        .displayOrder,
    ).toBe(4);
  });
});
