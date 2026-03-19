import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import CrudPageLayout from "@/components/pages/CrudPageLayout";
import Popup from "@/components/shared/Popup";
import {
  EducationControllerService,
  type base_service_Education,
} from "@/lib/api/client";
import { useCrudPage } from "@/hooks/crud/useCrudPage";
import ConfirmDialog from "@/components/shared/ConfirmDialog";

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
      <Form.Group className='mb-3'>
        <Form.Label>Institution</Form.Label>
        <Form.Control
          value={formData.institution ?? ""}
          onChange={(e) =>
            setFormData({ ...formData, institution: e.target.value })
          }
          required
        />
      </Form.Group>
      <Form.Group className='mb-3'>
        <Form.Label>Location</Form.Label>
        <Form.Control
          value={formData.location ?? ""}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          required
        />
      </Form.Group>
      <Form.Group className='mb-3'>
        <Form.Label>Start Date</Form.Label>
        <Form.Control
          type='date'
          value={formatDateForInput(formData.startDate)}
          onChange={(e) =>
            setFormData({ ...formData, startDate: e.target.value })
          }
          required
        />
      </Form.Group>
      <Form.Group className='mb-3'>
        <Form.Label>End Date</Form.Label>
        <Form.Control
          type='date'
          value={formatDateForInput(formData.endDate)}
          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
        />
      </Form.Group>
      <Form.Group className='mb-3'>
        <Form.Label>Degree</Form.Label>
        <Form.Control
          value={formData.degree ?? ""}
          onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
          required
        />
      </Form.Group>
      <Form.Group className='mb-3'>
        <Form.Label>Thesis</Form.Label>
        <Form.Control
          value={formData.thesis ?? ""}
          onChange={(e) => setFormData({ ...formData, thesis: e.target.value })}
        />
      </Form.Group>
      <Form.Group className='mb-3'>
        <Form.Label>Description</Form.Label>
        <Form.Control
          value={formData.description ?? ""}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </Form.Group>
      <Form.Group className='mb-3'>
        <Form.Label>Order Display</Form.Label>
        <Form.Control
          type='number'
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
        <ConfirmDialog
          isOpen={isDeleteModalOpen}
          title='Delete Education'
          message='Are you sure you want to delete this education entry?'
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
