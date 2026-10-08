import type { base_service_Project } from "@/api";
import { OverflowMenu } from "@/components/ui/overflow-menu";
import { ColorPills } from "@/components/ui/color-pills";

interface ProjectRowProps {
  project: base_service_Project;
  onEdit: () => void;
  onDelete: () => void;
}

export function ProjectRow({ project, onEdit, onDelete }: ProjectRowProps) {
  return (
    <tr onClick={onEdit}>
      <td data-label="Project">
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
      <td data-label="Stack">
        <ColorPills values={project.techStack} />
      </td>
      <td data-label="Order">{project.displayOrder}</td>
      <td
        className="text-end"
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
