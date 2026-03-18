import React from "react";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import CrudPageLayout from "@/components/pages/CrudPageLayout";
import Popup from "@/components/shared/Popup";
import FormInput from "@/components/shared/FormInput";
import {
  WorkExperienceControllerService,
  type base_service_WorkExperience,
} from "@/lib/api/client";
import { useCrudPage } from "@/hooks/crud/useCrudPage";
import DeleteConfirmation from "@/components/shared/DeleteConfirmationDialog";

const WorkExperiencePage = () => {
  const {
    items: workExperience,
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
  } = useCrudPage<base_service_WorkExperience, base_service_WorkExperience, number>({
    loadItems: () => WorkExperienceControllerService.listWorkExperience(),
    createItem: (payload) =>
      WorkExperienceControllerService.createWorkExperience(payload),
    updateItem: (payload) =>
      WorkExperienceControllerService.updateWorkExperience(payload),
    deleteItem: (id) =>
      WorkExperienceControllerService.deleteWorkExperience({ id }),
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
      }) as base_service_WorkExperience,
  });

  const wexForm = (
    <Popup
      closePopup={closePopup}
      title={isEditMode ? "Edit Work Experience" : "Add Work Experience"}
      onSubmit={saveItem}
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
          setFormData({
            ...formData,
            displayOrder: Number(e.target.value),
          })
        }
        required={true}
      />
    </Popup>
  );

  const wexPage = (
    <div className='d-grid gap-3'>
      {workExperience.map((experience) => (
        <Card
          key={experience.id}
          className='rounded-4 app-interactive-card app-resource-card'
          onClick={() => openPopup(experience)}
        >
          <Card.Body className='p-4 app-card-body'>
            <div className='d-flex justify-content-between align-items-start gap-3'>
              <div>
                <Card.Title className='fw-semibold mb-1 app-card-title'>
                  {experience.position}
                </Card.Title>
                <Card.Subtitle className='mb-3 text-secondary'>
                  {experience.company}
                </Card.Subtitle>
                <div className='d-flex flex-column gap-2 text-secondary'>
                  <div>{experience.location}</div>
                  <div>
                    {experience.startDate} -{" "}
                    {experience.endDate ? experience.endDate : "Present"}
                  </div>
                  <div style={{ whiteSpace: "pre-line" }}>
                    {experience.description}
                  </div>
                  <div className='d-flex flex-wrap gap-2'>
                    {experience.techStack &&
                      experience.techStack.split(",").map((tech, index) => (
                        <Badge key={index} bg='primary-subtle' text='primary'>
                          {tech.trim()}
                        </Badge>
                      ))}
                  </div>
                  <div>Order: {experience.displayOrder}</div>
                </div>
              </div>
              <div className='app-card-actions'>
                <Button
                  variant='outline-primary'
                  size='sm'
                  onClick={(e) => {
                    e.stopPropagation();
                    openPopup(experience);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant='outline-danger'
                  size='sm'
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmDelete(experience.id ?? null);
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
      title='Work Experience'
      toggleSort={toggleSort}
      loading={loading}
      error={error}
      isEmpty={workExperience.length === 0}
      showAddButton={!error && !showPopup}
      onAdd={() => openPopup()}
      modal={showPopup ? wexForm : null}
      deleteDialog={
        <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
      />
      }
    >
      {wexPage}
    </CrudPageLayout>
  );
};

export default WorkExperiencePage;
