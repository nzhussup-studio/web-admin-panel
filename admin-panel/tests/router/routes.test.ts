import routes from "@/router/routes";

describe("router/routes.ts", () => {
  test("defines the expected public and protected paths", () => {
    expect(routes).toHaveLength(14);
    expect(routes.map((route) => route.path)).toEqual([
      "/",
      "/projects",
      "/cv",
      "/cv/certifications",
      "/cv/work-experience",
      "/cv/skills",
      "/cv/education",
      "/albums",
      "/albums/:id",
      "/public/albums/:id",
      "/cv-generator",
      "/llm",
      "/forbidden",
      "*",
    ]);
  });

  test("marks public album, forbidden, and not-found as public routes", () => {
    const publicRoutes = routes.filter((route) => !route.isProtected);

    expect(publicRoutes).toHaveLength(3);
    expect(publicRoutes.map((route) => route.path)).toEqual([
      "/public/albums/:id",
      "/forbidden",
      "*",
    ]);
  });

  test("assigns a component to every route", () => {
    routes.forEach((route) => {
      expect(route.component).toBeDefined();
      expect(typeof route.component).toBe("function");
    });
  });

  test("keeps album details and cv subpages protected", () => {
    const protectedPaths = new Set(
      routes.filter((route) => route.isProtected).map((route) => route.path)
    );

    expect(protectedPaths.has("/albums/:id")).toBe(true);
    expect(protectedPaths.has("/cv/education")).toBe(true);
    expect(protectedPaths.has("/cv/skills")).toBe(true);
    expect(protectedPaths.has("/cv/work-experience")).toBe(true);
    expect(protectedPaths.has("/cv/certifications")).toBe(true);
  });
});
