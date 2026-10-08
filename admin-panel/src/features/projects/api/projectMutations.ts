import { ProjectControllerService, type base_service_Project } from "@/api";

export const createProject = (project: base_service_Project) =>
  ProjectControllerService.createProject(project);
export const updateProject = (project: base_service_Project) =>
  ProjectControllerService.updateProject(project);
export const deleteProject = (id: number) =>
  ProjectControllerService.deleteProject({ id });
