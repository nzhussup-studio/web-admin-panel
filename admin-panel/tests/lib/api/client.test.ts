describe("lib/api/client.ts", () => {
  test("sets the OpenAPI base url from config and exposes token from keycloak", async () => {
    jest.resetModules();
    jest.doMock("@/lib/auth/keycloak", () => ({
      __esModule: true,
      default: {
        authenticated: true,
        token: "token-123",
        updateToken: jest.fn().mockResolvedValue(true),
      },
    }));

    const moduleExports = await import("@/lib/api/client");
    const tokenResolver = moduleExports.OpenAPI.TOKEN as () => Promise<string>;

    expect(moduleExports.OpenAPI.BASE).toBe("http://localhost:8082");
    await expect(tokenResolver()).resolves.toBe("token-123");
  });

  test("returns an empty token string when keycloak is not authenticated", async () => {
    jest.resetModules();
    jest.doMock("@/lib/auth/keycloak", () => ({
      __esModule: true,
      default: {
        authenticated: false,
        token: null,
        updateToken: jest.fn().mockResolvedValue(false),
      },
    }));

    const moduleExports = await import("@/lib/api/client");
    const tokenResolver = moduleExports.OpenAPI.TOKEN as () => Promise<string>;

    await expect(tokenResolver()).resolves.toBe("");
  });
});
