import { ProjectControllerService, type base_service_Project } from "@/api";

export const createAdminProjects = (project: base_service_Project) =>
  ProjectControllerService.createAdminProjects(project);
export const updateAdminProjects = (project: base_service_Project) =>
  ProjectControllerService.updateAdminProjects(Number(project.id), project);
export const deleteAdminProjects = (id: number) =>
  ProjectControllerService.deleteAdminProjects(id);
