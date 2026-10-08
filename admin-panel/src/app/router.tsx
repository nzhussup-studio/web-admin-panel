import type { ComponentType } from "react";
import { Route, Routes } from "react-router-dom";
import { AdminShell } from "@/components/layout/admin-shell";
import { OverviewPage } from "@/features/overview";
import { ProjectsPage } from "@/features/projects";
import {
  CertificationsPage,
  CvPage,
  EducationPage,
  EducationPreviewPage,
  SkillsPage,
  WorkExperiencePage,
  WorkExperiencePreviewPage,
} from "@/features/cv";
import {
  AlbumDetailPage,
  AlbumsPage,
  PublicAlbumPage,
} from "@/features/albums";
import { CvGeneratorPage } from "@/features/cv-generator";
import { LlmConfigPage } from "@/features/llm-config";
import {
  BadGatewayPage,
  ForbiddenPage,
  GatewayTimeoutPage,
  InternalServerErrorPage,
  NotFoundPage,
  ServiceUnavailablePage,
} from "@/components/feedback/error-state";
import RequireAuth from "@/components/layout/admin-shell/RequireAuth";

interface AppRoute {
  path: string;
  component: ComponentType;
  isProtected: boolean;
}

const routes: AppRoute[] = [
  {
    path: "/",
    component: OverviewPage,
    isProtected: true,
  },
  {
    path: "/projects",
    component: ProjectsPage,
    isProtected: true,
  },
  {
    path: "/cv",
    component: CvPage,
    isProtected: true,
  },
  {
    path: "/cv/certifications",
    component: CertificationsPage,
    isProtected: true,
  },
  {
    path: "/cv/work-experience",
    component: WorkExperiencePage,
    isProtected: true,
  },
  {
    path: "/cv/work-experience/preview",
    component: WorkExperiencePreviewPage,
    isProtected: true,
  },
  {
    path: "/cv/skills",
    component: SkillsPage,
    isProtected: true,
  },
  {
    path: "/cv/education",
    component: EducationPage,
    isProtected: true,
  },
  {
    path: "/cv/education/preview",
    component: EducationPreviewPage,
    isProtected: true,
  },
  {
    path: "/albums",
    component: AlbumsPage,
    isProtected: true,
  },
  {
    path: "/albums/:id",
    component: PublicAlbumPage,
    isProtected: false,
  },
  {
    path: "/albums/:id/manage",
    component: AlbumDetailPage,
    isProtected: true,
  },
  {
    path: "/cv-generator",
    component: CvGeneratorPage,
    isProtected: true,
  },
  {
    path: "/llm",
    component: LlmConfigPage,
    isProtected: true,
  },
  {
    path: "/forbidden",
    component: ForbiddenPage,
    isProtected: false,
  },
  {
    path: "/500",
    component: InternalServerErrorPage,
    isProtected: false,
  },
  {
    path: "/502",
    component: BadGatewayPage,
    isProtected: false,
  },
  {
    path: "/503",
    component: ServiceUnavailablePage,
    isProtected: false,
  },
  {
    path: "/504",
    component: GatewayTimeoutPage,
    isProtected: false,
  },
  {
    path: "*",
    component: NotFoundPage,
    isProtected: false,
  },
];

export function AppRouter() {
  return (
    <Routes>
      {routes.map((route) => {
        const Component = route.component;
        const page = route.isProtected ? (
          <RequireAuth>
            <Component />
          </RequireAuth>
        ) : (
          <Component />
        );

        return (
          <Route
            key={route.path}
            path={route.path}
            element={<AdminShell>{page}</AdminShell>}
          />
        );
      })}
    </Routes>
  );
}
