import type { base_service_Project } from "@/api";
import { DataTable } from "@/components/ui/data-table";
import { ProjectRow } from "./ProjectRow";

interface ProjectListProps {
  projects: base_service_Project[];
  isAscending: boolean;
  onSort: () => void;
  onEdit: (project: base_service_Project) => void;
  onDelete: (id: number | null) => void;
}

export function ProjectList({
  projects,
  isAscending,
  onSort,
  onEdit,
  onDelete,
}: ProjectListProps) {
  return (
    <DataTable
      className="projects-table"
      columns={[
        { key: "project", label: "Project", width: "34%" },
        { key: "stack", label: "Stack", width: "46%" },
        { key: "order", label: "Order", width: "8%", sortable: true },
        { key: "actions", label: "Actions", width: "12%", align: "end" },
      ]}
      sortDirection={isAscending ? "asc" : "desc"}
      onSort={onSort}
      mobileSummary={`${projects.length} ${projects.length === 1 ? "project" : "projects"}`}
    >
      {projects.map((project) => (
        <ProjectRow
          key={project.id}
          project={project}
          onEdit={() => onEdit(project)}
          onDelete={() => onDelete(project.id ?? null)}
        />
      ))}
    </DataTable>
  );
}
