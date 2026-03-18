import React, { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import EditableCard from "@/components/shared/EditableCard";
import { ProjectControllerService, type base_service_Project } from "@/lib/api/client";
import { normalizeApiError } from "@/lib/api/errors";
import { usePopup } from "@/hooks/shared/usePopup";
import { useRenderPage } from "@/hooks/shared/useRenderPage";
import AddButton from "@/components/shared/AddButton";
import PopUp from "@/components/shared/Popup";
import FormInput from "@/components/shared/FormInput";
import PageSubHeader from "@/components/shared/PageSubHeader";
import DeleteConfirmation from "@/components/shared/DeleteConfirmationDialog";
import PageWrapper from "@/motion/PageTransition";
import LoadingElement from "@/components/states/LoadingState";
import ErrorElement from "@/components/states/ErrorState";
import NoInfoFoundElement from "@/components/states/EmptyState";

const ProjectsPage = () => {
  const [projects, setProjects] = useState<base_service_Project[]>([]);
  const [isAscending, setIsAscending] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [showLoading, setShowLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const {
    showPopup,
    formData,
    isEditMode,
    openPopup,
    closePopup,
    setFormData,
  } = usePopup<base_service_Project>();

  const fetchProjects = async () => {
    setShowLoading(true);
    setError(null);
    try {
      const fetchedProjects = await ProjectControllerService.listProject();
      const sortedProjects = [...fetchedProjects].sort((a, b) =>
        isAscending
          ? Number(a.displayOrder) - Number(b.displayOrder)
          : Number(b.displayOrder) - Number(a.displayOrder)
      );
      setProjects(sortedProjects as base_service_Project[]);
    } catch (fetchError) {
      setError(normalizeApiError(fetchError));
    } finally {
      setShowLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [isAscending]);

  const { renderPage } = useRenderPage(projects, showLoading, error);

  const saveProject = async () => {
    const payload = {
      ...formData,
      displayOrder: Number(formData.displayOrder),
    } as base_service_Project;
    if (isEditMode) {
      await ProjectControllerService.updateProject(payload);
    } else {
      await ProjectControllerService.createProject(payload);
    }
    await fetchProjects();
    closePopup();
  };

  const confirmDelete = (itemId?: number) => {
    setSelectedItemId(itemId ?? null);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (selectedItemId == null) return;
    try {
      await ProjectControllerService.deleteProject({ id: selectedItemId });
      setDeleteModalOpen(false);
      setSelectedItemId(null);
      await fetchProjects();
    } catch (deleteError) {
      setError(normalizeApiError(deleteError));
    }
  };

  const toggleSort = () => {
    setIsAscending((prev) => !prev);
  };

  const projectForm = (
    <PopUp
      closePopup={closePopup}
      title={isEditMode ? "Edit Project" : "Add Project"}
      onSubmit={saveProject}
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
          setFormData({ ...formData, displayOrder: e.target.value })
        }
        required={true}
      />
    </PopUp>
  );

  const projectPage = (
    <PageWrapper>
      <div className='mt-4'>
        {projects.map((project) => (
          <EditableCard
            key={project.id}
            title={project.name}
            onEdit={() => openPopup(project)}
            onDelete={() => confirmDelete(project.id)}
          >
            <div className='mt-4'>
              <div>
                {project.techStack &&
                  project.techStack.split(",").map((tech, index) => (
                    <span key={index} className='badge bg-primary me-2'>
                      {tech.trim()}{" "}
                    </span>
                  ))}
              </div>
              {project.url && (
                <a
                  href={project.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='btn btn-link'
                  onClick={(e) => e.stopPropagation()}
                >
                  View Project
                </a>
              )}
              <p>Order: {project.displayOrder}</p>
            </div>
          </EditableCard>
        ))}
      </div>
    </PageWrapper>
  );

  return (
    <>
      <Header text={"Project Management"} />
      <div className='container my-5'>
        <PageSubHeader toggleSort={toggleSort} />
        {renderPage(
          ErrorElement,
          LoadingElement,
          NoInfoFoundElement,
          projectPage
        )}
      </div>

      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />

      {showPopup && projectForm}
      {!error && !showPopup && <AddButton openPopup={openPopup} />}
    </>
  );
};

export default ProjectsPage;
