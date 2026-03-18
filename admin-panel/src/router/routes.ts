import type { AppRoute } from "@/types/router";
import LoginPage from "@/pages/auth/LoginPage";
import HomePage from "@/pages/home/HomePage";
import CvPage from "@/pages/cv/CvPage";
import ProjectsPage from "@/pages/projects/ProjectsPage";
import CertificationsPage from "@/pages/cv/CertificationsPage";
import EducationPage from "@/pages/cv/EducationPage";
import WorkExperiencePage from "@/pages/cv/WorkExperiencePage";
import SkillsPage from "@/pages/cv/SkillsPage";
import NotFoundPage from "@/pages/errors/NotFoundPage";
import UsersPage from "@/pages/users/UsersPage";
import AlbumsPage from "@/pages/albums/AlbumsPage";
import AlbumPage from "@/pages/albums/AlbumPage";
import CvGeneratorPage from "@/pages/cv/CvGeneratorPage";

const routes: AppRoute[] = [
  {
    path: "/login",
    component: LoginPage,
    isProtected: false,
  },
  {
    path: "/",
    component: HomePage,
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
    path: "/users",
    component: UsersPage,
    isProtected: true,
  },
  {
    path: "/albums",
    component: AlbumsPage,
    isProtected: true,
  },
  {
    path: "/albums/:id",
    component: AlbumPage,
    isProtected: true,
  },
  {
    path: "/cv-generator",
    component: CvGeneratorPage,
    isProtected: true,
  },
  {
    path: "*",
    component: NotFoundPage,
    isProtected: false,
  },
];

export default routes;
