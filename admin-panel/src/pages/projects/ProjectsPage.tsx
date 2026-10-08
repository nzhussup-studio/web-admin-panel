import React from "react";
import { queryKeys } from "@/api";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import { Ellipsis, ExternalLink } from "lucide-react";
import CrudPageLayout from "@/components/pages/CrudPageLayout";
import {
  ProjectControllerService,
  type base_service_Project,
} from "@/lib/api/client";
import { useCrudPage } from "@/hooks/crud/useCrudPage";
import Popup from "@/components/shared/Popup";
import ConfirmDialog from "@/components/shared/ConfirmDialog";

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
    queryKey: queryKeys.projects,
    loadItems: () => ProjectControllerService.listProject(),
    createItem: (payload) => ProjectControllerService.createProject(payload),
    updateItem: (payload) => ProjectControllerService.updateProject(payload),
    deleteItem: (id) => ProjectControllerService.deleteProject({ id }),
    getItemId: (item) => item.id ?? null,
    sortItems: (items, isAscending) =>
      items.sort((a, b) =>
        isAscending
          ? Number(a.displayOrder) - Number(b.displayOrder)
          : Number(b.displayOrder) - Number(a.displayOrder),
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
      <Form.Group className="mb-3">
        <Form.Label>Project Name</Form.Label>
        <Form.Control
          value={formData.name ?? ""}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Tech Stack</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={formData.techStack ?? ""}
          onChange={(e) =>
            setFormData({ ...formData, techStack: e.target.value })
          }
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>URL</Form.Label>
        <Form.Control
          value={formData.url ?? ""}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Order Display</Form.Label>
        <Form.Control
          type="number"
          value={formData.displayOrder ?? ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              displayOrder: Number(e.target.value),
            })
          }
          required
        />
      </Form.Group>
    </Popup>
  );

  const projectPage = (
    <div className="data-table-shell">
      <Table responsive hover className="align-middle mb-0 admin-data-table">
        <thead>
          <tr>
            <th>Project</th>
            <th>Stack</th>
            <th>Order</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id} onClick={() => openPopup(project)}>
              <td data-label="Project">
                <div className="fw-semibold text-primary">{project.name}</div>
                {project.url ? (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(event) => event.stopPropagation()}
                    className="small text-secondary"
                  >
                    Open project <ExternalLink size={13} />
                  </a>
                ) : null}
              </td>
              <td data-label="Stack">
                <div className="d-flex flex-wrap gap-2">
                  {project.techStack?.split(",").map((tech) => (
                    <Badge key={tech} bg="primary-subtle" text="primary">
                      {tech.trim()}
                    </Badge>
                  ))}
                </div>
              </td>
              <td data-label="Order">{project.displayOrder}</td>
              <td
                className="text-end"
                data-label="Actions"
                onClick={(event) => event.stopPropagation()}
              >
                <Dropdown align="end">
                  <Dropdown.Toggle
                    as={Button}
                    size="sm"
                    variant="outline-secondary"
                    aria-label={`Actions for ${project.name}`}
                  >
                    <Ellipsis size={17} />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => openPopup(project)}>
                      Edit
                    </Dropdown.Item>
                    <Dropdown.Item
                      className="text-danger"
                      onClick={() => confirmDelete(project.id ?? null)}
                    >
                      Delete
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );

  return (
    <CrudPageLayout
      title="Projects"
      toggleSort={toggleSort}
      loading={loading}
      error={error}
      isEmpty={projects.length === 0}
      showAddButton={!error && !showPopup}
      onAdd={() => openPopup()}
      modal={showPopup ? projectForm : null}
      deleteDialog={
        <ConfirmDialog
          isOpen={isDeleteModalOpen}
          title="Delete Project"
          message="Are you sure you want to delete this project?"
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
