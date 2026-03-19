import config from "@/config/app-config";

describe("config/app-config.ts", () => {
  test("falls back to localhost when no env api base is defined", () => {
    expect(config).toEqual({
      apiBase: "http://localhost:8080",
      showNoInfoDelay: 500,
      cvGeneratorLocalStorageKey: "cvGeneratorSelectedItems",
    });
  });
});
