import config from "@/config/app-config";

describe("config/app-config.ts", () => {
  test("defines the expected stable application config", () => {
    expect(config).toEqual({
      apiBase: "https://api.nzhussup.com",
      showNoInfoDelay: 500,
      cvGeneratorLocalStorageKey: "cvGeneratorSelectedItems",
    });
  });
});
