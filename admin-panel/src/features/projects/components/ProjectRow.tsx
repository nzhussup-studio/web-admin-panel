import type { base_service_Project } from "@/api";
import { OverflowMenu } from "@/components/ui/overflow-menu";
import { ColorPills } from "@/components/ui/color-pills";
import { DataTableMobileCard } from "@/components/ui/data-table";

interface ProjectRowProps {
  project: base_service_Project;
  onEdit: () => void;
  onDelete: () => void;
}

export function ProjectRow({ project, onEdit, onDelete }: ProjectRowProps) {
  return (
    <tr onClick={onEdit}>
      <DataTableMobileCard
        colSpan={4}
        title={project.name}
        subtitle={
          project.url ? (
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              onClick={(event) => event.stopPropagation()}
            >
              {project.url.replace(/^https?:\/\//, "")}
            </a>
          ) : null
        }
        metadata={[{ label: "Order", value: project.displayOrder }]}
        actions={
          <OverflowMenu
            label={`Actions for ${project.name}`}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        }
      >
        <ColorPills values={project.techStack} />
      </DataTableMobileCard>
      <td className="desktop-data-cell" data-label="Project">
        <div className="project-cell">
          <div>
            <div className="project-name">{project.name}</div>
            {project.url ? (
              <a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                onClick={(event) => event.stopPropagation()}
                className="small text-secondary"
              >
                {project.url.replace(/^https?:\/\//, "")}
              </a>
            ) : null}
          </div>
        </div>
      </td>
      <td className="desktop-data-cell" data-label="Stack">
        <ColorPills values={project.techStack} />
      </td>
      <td className="desktop-data-cell" data-label="Order">
        {project.displayOrder}
      </td>
      <td
        className="text-end desktop-data-cell"
        data-label="Actions"
        onClick={(event) => event.stopPropagation()}
      >
        <OverflowMenu
          label={`Actions for ${project.name}`}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </td>
    </tr>
  );
}
