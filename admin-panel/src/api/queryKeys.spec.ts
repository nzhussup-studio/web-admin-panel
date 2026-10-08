import { describe, expect, it } from "vitest";
import { queryKeys } from "./queryKeys";

describe("queryKeys", () => {
  it("builds stable, scoped album keys", () => {
    expect(queryKeys.albums.list("public")).toEqual([
      "albums",
      "list",
      "public",
    ]);
    expect(queryKeys.albums.detail("album-1")).toEqual([
      "albums",
      "detail",
      "album-1",
    ]);
    expect(queryKeys.albums.upload("album-1", "job-2")).toEqual([
      "albums",
      "upload",
      "album-1",
      "job-2",
    ]);
  });

  it("scopes LLM summaries by language", () => {
    expect(queryKeys.llm.summary("de")).toEqual(["llm", "summary", "de"]);
  });
});
