describe("lib/api/client.ts", () => {
  test("sets the OpenAPI base url from config and exposes token from localStorage", async () => {
    localStorage.setItem("token", "token-123");

    const moduleExports = await import("@/lib/api/client");
    const tokenResolver = moduleExports.OpenAPI.TOKEN as () => Promise<string>;

    expect(moduleExports.OpenAPI.BASE).toBe("http://localhost:8080");
    await expect(tokenResolver()).resolves.toBe("token-123");
  });

  test("returns an empty token string when localStorage has no token", async () => {
    localStorage.removeItem("token");

    const moduleExports = await import("@/lib/api/client");
    const tokenResolver = moduleExports.OpenAPI.TOKEN as () => Promise<string>;

    await expect(tokenResolver()).resolves.toBe("");
  });
});
