import { queryKeys } from "@/api";

describe("queryKeys", () => {
  it("keeps list and detail caches stable and isolated", () => {
    expect(queryKeys.projects).toEqual(["projects"]);
    expect(queryKeys.albums.list("all")).toEqual(["albums", "list", "all"]);
    expect(queryKeys.albums.detail("summer")).toEqual(["albums", "detail", "summer"]);
    expect(queryKeys.albums.detail("summer")).not.toEqual(queryKeys.albums.detail("winter"));
  });
});
