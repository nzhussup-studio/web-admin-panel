import React, { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import EditableCard from "@/components/shared/EditableCard";
import AddButton from "@/components/shared/AddButton";
import PopUp from "@/components/shared/Popup";
import FormInput from "@/components/shared/FormInput";
import {
  WorkExperienceControllerService,
  type base_service_WorkExperience,
} from "@/lib/api/client";
import { normalizeApiError } from "@/lib/api/errors";
import { usePopup } from "@/hooks/shared/usePopup";
import { useRenderPage } from "@/hooks/shared/useRenderPage";
import PageSubHeader from "@/components/shared/PageSubHeader";
import DeleteConfirmation from "@/components/shared/DeleteConfirmationDialog";
import PageWrapper from "@/motion/PageTransition";
import LoadingElement from "@/components/states/LoadingState";
import ErrorElement from "@/components/states/ErrorState";
import NoInfoFoundElement from "@/components/states/EmptyState";

const WorkExp = () => {
  const [workExperience, setWorkExperience] = useState<
    base_service_WorkExperience[]
  >([]);
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
  } = usePopup<base_service_WorkExperience>();

  const fetchWorkExperience = async () => {
    setShowLoading(true);
    setError(null);
    try {
      const fetchedWorkExperience =
        await WorkExperienceControllerService.listWorkExperience();
      const sortedWorkExperience = [...fetchedWorkExperience].sort((a, b) =>
        isAscending
          ? Number(a.displayOrder) - Number(b.displayOrder)
          : Number(b.displayOrder) - Number(a.displayOrder)
      );
      setWorkExperience(sortedWorkExperience as base_service_WorkExperience[]);
    } catch (fetchError) {
      setError(normalizeApiError(fetchError));
    } finally {
      setShowLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkExperience();
  }, [isAscending]);

  const { renderPage } = useRenderPage(workExperience, showLoading, error);

  const saveWorkExperience = async () => {
    const payload = {
      ...formData,
      displayOrder: Number(formData.displayOrder),
    } as base_service_WorkExperience;
    if (isEditMode) {
      await WorkExperienceControllerService.updateWorkExperience(payload);
    } else {
      await WorkExperienceControllerService.createWorkExperience(payload);
    }
    await fetchWorkExperience();
    closePopup();
  };

  const confirmDelete = (itemId?: number) => {
    setSelectedItemId(itemId ?? null);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (selectedItemId == null) return;
    try {
      await WorkExperienceControllerService.deleteWorkExperience({
        id: selectedItemId,
      });
      setDeleteModalOpen(false);
      setSelectedItemId(null);
      await fetchWorkExperience();
    } catch (deleteError) {
      setError(normalizeApiError(deleteError));
    }
  };

  const toggleSort = () => {
    setIsAscending((prev) => !prev);
  };

  const wexForm = (
    <PopUp
      closePopup={closePopup}
      title={isEditMode ? "Edit Work Experience" : "Add Work Experience"}
      onSubmit={saveWorkExperience}
    >
      <FormInput
        label='Job Title'
        value={formData.position}
        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
        required={true}
      />
      <FormInput
        label='Company'
        value={formData.company}
        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
        required={true}
      />
      <FormInput
        label={"Location"}
        value={formData.location}
        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        required={true}
      />
      <FormInput
        label='Start Date'
        value={formData.startDate}
        onChange={(e) =>
          setFormData({ ...formData, startDate: e.target.value })
        }
        required={true}
      />
      <FormInput
        label='End Date'
        value={formData.endDate}
        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
        required={false}
      />
      <FormInput
        label='Description'
        type='textarea'
        rows={10}
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        required={true}
      />
      <FormInput
        label='Tech Stack (comma-separated)'
        value={formData.techStack}
        onChange={(e) =>
          setFormData({ ...formData, techStack: e.target.value })
        }
        required={false}
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

  const wexPage = (
    <PageWrapper>
      <div className='mt-4'>
        {workExperience.map((experience) => (
          <EditableCard
            key={experience.id}
            title={experience.position}
            onEdit={() => openPopup(experience)}
            onDelete={() => confirmDelete(experience.id)}
          >
            <div className='mb-3'>
              <h5>Company: {experience.company}</h5>
              <p>Location: {experience.location}</p>
              <p>
                {experience.startDate} -{" "}
                {experience.endDate ? experience.endDate : "Present"}
              </p>
              <p>
                Description:
                <br />
                <span style={{ whiteSpace: "pre-line" }}>
                  {experience.description}
                </span>
              </p>

              <p>
                Tech Stack:{" "}
                {
                  <div>
                    {experience.techStack &&
                      experience.techStack.split(",").map((tech, index) => (
                        <span key={index} className='badge bg-primary me-2'>
                          {tech.trim()}{" "}
                        </span>
                      ))}
                  </div>
                }
              </p>
              <p>Order: {experience.displayOrder}</p>
            </div>
          </EditableCard>
        ))}
      </div>
    </PageWrapper>
  );

  return (
    <>
      <Header text={"Work Experience"} />
      <div className='container my-5'>
        <PageSubHeader toggleSort={toggleSort} />
        {renderPage(ErrorElement, LoadingElement, NoInfoFoundElement, wexPage)}
      </div>
      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />
      {showPopup && wexForm}
      {!error && !showPopup && <AddButton openPopup={openPopup} />}
    </>
  );
};

export default WorkExp;
