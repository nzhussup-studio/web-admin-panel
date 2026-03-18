import React, { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import EditableCard from "@/components/shared/EditableCard";
import AddButton from "@/components/shared/AddButton";
import PopUp from "@/components/shared/Popup";
import FormInput from "@/components/shared/FormInput";
import PageSubHeader from "@/components/shared/PageSubHeader";
import {
  EducationControllerService,
  type base_service_Education,
} from "@/lib/api/client";
import { normalizeApiError } from "@/lib/api/errors";
import { usePopup } from "@/hooks/shared/usePopup";
import { useRenderPage } from "@/hooks/shared/useRenderPage";
import DeleteConfirmation from "@/components/shared/DeleteConfirmationDialog";
import PageWrapper from "@/motion/PageTransition";
import LoadingElement from "@/components/states/LoadingState";
import ErrorElement from "@/components/states/ErrorState";
import NoInfoFoundElement from "@/components/states/EmptyState";

const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

const EducationPage = () => {
  const [education, setEducation] = useState<base_service_Education[]>([]);
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
  } = usePopup<base_service_Education>();

  const fetchEducation = async () => {
    setShowLoading(true);
    setError(null);
    try {
      const fetchedEducation = await EducationControllerService.listEducation();
      const sortedEducation = [...fetchedEducation].sort((a, b) =>
        isAscending
          ? Number(a.displayOrder) - Number(b.displayOrder)
          : Number(b.displayOrder) - Number(a.displayOrder)
      );
      setEducation(sortedEducation as base_service_Education[]);
    } catch (fetchError) {
      setError(normalizeApiError(fetchError));
    } finally {
      setShowLoading(false);
    }
  };

  useEffect(() => {
    fetchEducation();
  }, [isAscending]);

  const saveEducation = async () => {
    const payload = {
      ...formData,
      displayOrder: Number(formData.displayOrder),
    } as base_service_Education;
    if (isEditMode) {
      await EducationControllerService.updateEducation(payload);
    } else {
      await EducationControllerService.createEducation(payload);
    }
    await fetchEducation();
    closePopup();
  };

  const confirmDelete = (itemId?: number) => {
    setSelectedItemId(itemId ?? null);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (selectedItemId == null) return;
    try {
      await EducationControllerService.deleteEducation({ id: selectedItemId });
      setDeleteModalOpen(false);
      setSelectedItemId(null);
      await fetchEducation();
    } catch (deleteError) {
      setError(normalizeApiError(deleteError));
    }
  };

  const toggleSort = () => {
    setIsAscending((prev) => !prev);
  };

  const { renderPage } = useRenderPage(education, showLoading, error);

  const eduForm = (
    <PopUp
      closePopup={closePopup}
      title={isEditMode ? "Edit Education" : "Add Education"}
      onSubmit={saveEducation}
    >
      <FormInput
        label='Institution'
        value={formData.institution}
        onChange={(e) =>
          setFormData({ ...formData, institution: e.target.value })
        }
        required={true}
      />
      <FormInput
        label='Location'
        value={formData.location}
        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        required={true}
      />
      <FormInput
        label='Start Date'
        type='date'
        value={formatDateForInput(formData.startDate)}
        onChange={(e) =>
          setFormData({ ...formData, startDate: e.target.value })
        }
        required={true}
      />
      <FormInput
        label='End Date'
        type='date'
        value={formatDateForInput(formData.endDate)}
        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
      />
      <FormInput
        label='Degree'
        value={formData.degree}
        onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
        required={true}
      />
      <FormInput
        label='Thesis'
        value={formData.thesis}
        onChange={(e) => setFormData({ ...formData, thesis: e.target.value })}
      />
      <FormInput
        label='Description'
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
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

  const eduPage = (
    <PageWrapper>
      <div className='mt-4'>
        {education.map((edu) => (
          <EditableCard
            key={edu.id}
            title={edu.degree}
            onEdit={() => openPopup(edu)}
            onDelete={() => confirmDelete(edu.id)}
          >
            <p>{edu.institution}</p>
            <p>{edu.location}</p>
            <p>
              {new Date(edu.startDate).toLocaleDateString()} -{" "}
              {edu.endDate
                ? new Date(edu.endDate).toLocaleDateString()
                : "Present"}
            </p>
            {edu.thesis && <p>Thesis: {edu.thesis}</p>}
            {edu.description && <p>Description: {edu.description}</p>}
            <p>Order: {edu.displayOrder}</p>
          </EditableCard>
        ))}
      </div>
    </PageWrapper>
  );

  return (
    <>
      <Header text={"Education"} />
      <div className='container my-5'>
        <PageSubHeader toggleSort={toggleSort} />
        {renderPage(ErrorElement, LoadingElement, NoInfoFoundElement, eduPage)}
      </div>
      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />

      {showPopup && eduForm}
      {!error && !showPopup && <AddButton openPopup={openPopup} />}
    </>
  );
};

export default EducationPage;
