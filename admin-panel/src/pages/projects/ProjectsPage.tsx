import React from "react";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import CrudPageLayout from "@/components/pages/CrudPageLayout";
import { ProjectControllerService, type base_service_Project } from "@/lib/api/client";
import { useCrudPage } from "@/hooks/crud/useCrudPage";
import Popup from "@/components/shared/Popup";
import FormInput from "@/components/shared/FormInput";
import DeleteConfirmation from "@/components/shared/DeleteConfirmationDialog";

const ProjectsPage = () => {
  const {
    items: projects,
    loading,
    error,
    toggleSort,
    showPopup,
    formData,
    setFormData,
    isEditMode,
    openPopup,
    closePopup,
    saveItem,
    isDeleteModalOpen,
    confirmDelete,
    closeDeleteModal,
    handleDelete,
  } = useCrudPage<base_service_Project, base_service_Project, number>({
    loadItems: () => ProjectControllerService.listProject(),
    createItem: (payload) => ProjectControllerService.createProject(payload),
    updateItem: (payload) => ProjectControllerService.updateProject(payload),
    deleteItem: (id) => ProjectControllerService.deleteProject({ id }),
    getItemId: (item) => item.id ?? null,
    sortItems: (items, isAscending) =>
      items.sort((a, b) =>
        isAscending
          ? Number(a.displayOrder) - Number(b.displayOrder)
          : Number(b.displayOrder) - Number(a.displayOrder)
      ),
    toPayload: (data) =>
      ({
        ...data,
        displayOrder: Number(data.displayOrder),
      }) as base_service_Project,
  });

  const projectForm = (
    <Popup
      closePopup={closePopup}
      title={isEditMode ? "Edit Project" : "Add Project"}
      onSubmit={saveItem}
    >
      <FormInput
        label='Project Name'
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required={true}
      />
      <FormInput
        label='Tech Stack'
        type='textarea'
        value={formData.techStack}
        onChange={(e) =>
          setFormData({ ...formData, techStack: e.target.value })
        }
        required={true}
      />
      <FormInput
        label='URL'
        value={formData.url}
        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
        required={true}
      />
      <FormInput
        label='Order Display'
        type='number'
        value={formData.displayOrder}
        onChange={(e) =>
          setFormData({
            ...formData,
            displayOrder: Number(e.target.value),
          })
        }
        required={true}
      />
    </Popup>
  );

  const projectPage = (
    <div className='d-grid gap-3'>
      {projects.map((project) => (
        <Card
          key={project.id}
          className='rounded-4 app-interactive-card app-resource-card'
          onClick={() => openPopup(project)}
        >
          <Card.Body className='p-4 app-card-body'>
            <div className='d-flex justify-content-between align-items-start gap-3'>
              <div>
                <Card.Title className='fw-semibold mb-3 app-card-title'>
                  {project.name}
                </Card.Title>
                <div className='d-flex flex-wrap gap-2 mb-3'>
                  {project.techStack &&
                    project.techStack.split(",").map((tech, index) => (
                      <Badge key={index} bg='primary-subtle' text='primary'>
                        {tech.trim()}
                      </Badge>
                    ))}
                </div>
              </div>
              <div className='app-card-actions'>
                <Button
                  variant='outline-primary'
                  size='sm'
                  onClick={(e) => {
                    e.stopPropagation();
                    openPopup(project);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant='outline-danger'
                  size='sm'
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmDelete(project.id ?? null);
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
            <div className='d-flex flex-wrap align-items-center gap-3'>
              {project.url && (
                <Button
                  variant='link'
                  className='p-0'
                  href={project.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  onClick={(e) => e.stopPropagation()}
                >
                  View Project
                </Button>
              )}
              <span className='text-secondary'>Order: {project.displayOrder}</span>
            </div>
          </Card.Body>
        </Card>
      ))}
    </div>
  );

  return (
    <CrudPageLayout
      title='Project Management'
      toggleSort={toggleSort}
      loading={loading}
      error={error}
      isEmpty={projects.length === 0}
      showAddButton={!error && !showPopup}
      onAdd={() => openPopup()}
      modal={showPopup ? projectForm : null}
      deleteDialog={
        <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
      />
      }
    >
      {projectPage}
    </CrudPageLayout>
  );
};

export default ProjectsPage;
