import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import CrudPageLayout from "@/components/pages/CrudPageLayout";
import Popup from "@/components/shared/Popup";
import FormInput from "@/components/shared/FormInput";
import {
  EducationControllerService,
  type base_service_Education,
} from "@/lib/api/client";
import { useCrudPage } from "@/hooks/crud/useCrudPage";
import DeleteConfirmation from "@/components/shared/DeleteConfirmationDialog";

const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

const EducationPage = () => {
  const {
    items: education,
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
  } = useCrudPage<base_service_Education, base_service_Education, number>({
    loadItems: () => EducationControllerService.listEducation(),
    createItem: (payload) => EducationControllerService.createEducation(payload),
    updateItem: (payload) => EducationControllerService.updateEducation(payload),
    deleteItem: (id) => EducationControllerService.deleteEducation({ id }),
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
      }) as base_service_Education,
  });

  const eduForm = (
    <Popup
      closePopup={closePopup}
      title={isEditMode ? "Edit Education" : "Add Education"}
      onSubmit={saveItem}
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
          setFormData({
            ...formData,
            displayOrder: Number(e.target.value),
          })
        }
        required={true}
      />
    </Popup>
  );

  const eduPage = (
    <div className='d-grid gap-3'>
      {education.map((edu) => (
        <Card
          key={edu.id}
          className='rounded-4 app-interactive-card app-resource-card'
          onClick={() => openPopup(edu)}
        >
          <Card.Body className='p-4 app-card-body'>
            <div className='d-flex justify-content-between align-items-start gap-3'>
              <div>
                <Card.Title className='fw-semibold mb-3 app-card-title'>{edu.degree}</Card.Title>
                <div className='d-flex flex-column gap-2 text-secondary'>
                  <div>{edu.institution}</div>
                  <div>{edu.location}</div>
                  <div>
                    {new Date(edu.startDate).toLocaleDateString()} -{" "}
                    {edu.endDate
                      ? new Date(edu.endDate).toLocaleDateString()
                      : "Present"}
                  </div>
                  {edu.thesis ? <div>Thesis: {edu.thesis}</div> : null}
                  {edu.description ? <div>{edu.description}</div> : null}
                  <div>Order: {edu.displayOrder}</div>
                </div>
              </div>
              <div className='app-card-actions'>
                <Button
                  variant='outline-primary'
                  size='sm'
                  onClick={(e) => {
                    e.stopPropagation();
                    openPopup(edu);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant='outline-danger'
                  size='sm'
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmDelete(edu.id ?? null);
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      ))}
    </div>
  );

  return (
    <CrudPageLayout
      title='Education'
      toggleSort={toggleSort}
      loading={loading}
      error={error}
      isEmpty={education.length === 0}
      showAddButton={!error && !showPopup}
      onAdd={() => openPopup()}
      modal={showPopup ? eduForm : null}
      deleteDialog={
        <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
      />
      }
    >
      {eduPage}
    </CrudPageLayout>
  );
};

export default EducationPage;
