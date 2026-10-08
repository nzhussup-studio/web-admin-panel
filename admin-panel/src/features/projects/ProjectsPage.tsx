import { queryKeys, useResourceEditor, type base_service_Project } from "@/api";
import { PageContainer } from "@/components/layout/page-container";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { FormDrawer } from "@/components/ui/form-drawer";
import { ResourceForm } from "@/components/ui/resource-form";
import {
  createProject,
  deleteProject,
  listProjects,
  updateProject,
} from "./api";
import { ProjectList } from "./components";
import {
  projectFormFields,
  sortProjects,
  toProjectPayload,
} from "./projectData";

const ProjectsPage = () => {
  const projects = useResourceEditor<
    base_service_Project,
    base_service_Project,
    number
  >({
    queryKey: queryKeys.projects,
    loadItems: listProjects,
    createItem: createProject,
    updateItem: updateProject,
    deleteItem: deleteProject,
    sortItems: sortProjects,
    toPayload: toProjectPayload,
  });

  return (
    <PageContainer
      className="projects-page-shell"
      title="Projects"
      description="Manage your portfolio projects. Update details, tech stack, ordering and visibility."
      toggleSort={projects.toggleSort}
      showSort={false}
      loading={projects.loading}
      error={projects.error}
      isEmpty={projects.items.length === 0}
      showAddButton={!projects.error && !projects.showPopup}
      onAdd={() => projects.openPopup()}
      addLabel="Add project"
      modal={
        projects.showPopup ? (
          <FormDrawer
            closePopup={projects.closePopup}
            title={projects.isEditMode ? "Edit Project" : "Add Project"}
            onSubmit={projects.saveItem}
          >
            <ResourceForm
              fields={projectFormFields}
              value={projects.formData}
              onChange={projects.setFormData}
            />
          </FormDrawer>
        ) : null
      }
      deleteDialog={
        <ConfirmDialog
          isOpen={projects.isDeleteModalOpen}
          title="Delete Project"
          message="Are you sure you want to delete this project?"
          onClose={projects.closeDeleteModal}
          onConfirm={projects.handleDelete}
        />
      }
    >
      <ProjectList
        projects={projects.items}
        isAscending={projects.isAscending}
        onSort={projects.toggleSort}
        onEdit={projects.openPopup}
        onDelete={projects.confirmDelete}
      />
    </PageContainer>
  );
};

export default ProjectsPage;
