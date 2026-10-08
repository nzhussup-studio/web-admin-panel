import type { base_service_WorkExperience } from "@/api";
import type { ResourceFormField } from "@/components/ui/resource-form";

export const workExperienceFormFields: ResourceFormField<base_service_WorkExperience>[] =
  [
    { key: "position", label: "Job title", required: true },
    { key: "company", label: "Company", required: true },
    { key: "location", label: "Location", required: true },
    { key: "startDate", label: "Start date", type: "date", required: true },
    { key: "endDate", label: "End date", type: "date" },
    {
      key: "description",
      label: "Description",
      type: "markdown",
      rows: 8,
      required: true,
    },
    { key: "techStack", label: "Tech stack (comma-separated)" },
    {
      key: "displayOrder",
      label: "Display order",
      type: "number",
      required: true,
    },
  ];
