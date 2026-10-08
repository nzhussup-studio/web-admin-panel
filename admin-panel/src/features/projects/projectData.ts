import type { base_service_Project } from "@/api";
import type { ResourceFormField } from "@/components/ui/resource-form";

export const projectFormFields: ResourceFormField<base_service_Project>[] = [
  { key: "name", label: "Project name", required: true },
  {
    key: "techStack",
    label: "Tech stack (comma-separated)",
    type: "textarea",
    rows: 3,
    required: true,
  },
  { key: "url", label: "URL", type: "url", required: true },
  {
    key: "displayOrder",
    label: "Display order",
    type: "number",
    required: true,
  },
];

export const sortProjects = (
  projects: base_service_Project[],
  ascending: boolean,
) =>
  projects.sort((a, b) =>
    ascending
      ? Number(a.displayOrder) - Number(b.displayOrder)
      : Number(b.displayOrder) - Number(a.displayOrder),
  );

export const toProjectPayload = (project: Partial<base_service_Project>) =>
  ({
    ...project,
    displayOrder: Number(project.displayOrder),
  }) as base_service_Project;
