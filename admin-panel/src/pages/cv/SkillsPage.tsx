import React from "react";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import CrudPageLayout from "@/components/pages/CrudPageLayout";
import Popup from "@/components/shared/Popup";
import { SkillControllerService, type base_service_Skill } from "@/lib/api/client";
import { useCrudPage } from "@/hooks/crud/useCrudPage";
import ConfirmDialog from "@/components/shared/ConfirmDialog";

const SkillsPage = () => {
  const {
    items: skills,
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
  } = useCrudPage<base_service_Skill, base_service_Skill, number>({
    loadItems: () => SkillControllerService.listSkill(),
    createItem: (payload) => SkillControllerService.createSkill(payload),
    updateItem: (payload) => SkillControllerService.updateSkill(payload),
    deleteItem: (id) => SkillControllerService.deleteSkill({ id }),
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
      }) as base_service_Skill,
  });

  const skillForm = (
    <Popup
      closePopup={closePopup}
      title={isEditMode ? "Edit Skill" : "Add Skill"}
      onSubmit={saveItem}
    >
      <Form.Group className='mb-3'>
        <Form.Label>Category</Form.Label>
        <Form.Control
          value={formData.category ?? ""}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          required
        />
      </Form.Group>
      <Form.Group className='mb-3'>
        <Form.Label>Skill Names (comma-separated)</Form.Label>
        <Form.Control
          value={formData.skillNames ?? ""}
          onChange={(e) =>
            setFormData({ ...formData, skillNames: e.target.value })
          }
          required
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

  const skillPage = (
    <div className='d-grid gap-3'>
      {skills.map((skill) => (
        <Card
          key={skill.id}
          className='rounded-4 app-interactive-card app-resource-card'
          onClick={() => openPopup(skill)}
        >
          <Card.Body className='p-4 app-card-body'>
            <div className='d-flex justify-content-between align-items-start gap-3'>
              <div>
                <Card.Title className='fw-semibold mb-3 app-card-title'>
                  {skill.category}
                </Card.Title>
                <div className='d-flex flex-wrap gap-2 mb-3'>
                  {skill.skillNames.split(", ").map((skillName, index) => (
                    <Badge key={index} bg='primary-subtle' text='primary'>
                      {skillName}
                    </Badge>
                  ))}
                </div>
                <div className='text-secondary'>Order: {skill.displayOrder}</div>
              </div>
              <div className='app-card-actions'>
                <Button
                  variant='outline-primary'
                  size='sm'
                  onClick={(e) => {
                    e.stopPropagation();
                    openPopup(skill);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant='outline-danger'
                  size='sm'
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmDelete(skill.id ?? null);
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
      title='Skills'
      toggleSort={toggleSort}
      loading={loading}
      error={error}
      isEmpty={skills.length === 0}
      showAddButton={!error && !showPopup}
      onAdd={() => openPopup()}
      modal={showPopup ? skillForm : null}
      deleteDialog={
        <ConfirmDialog
          isOpen={isDeleteModalOpen}
          title='Delete Skill Group'
          message='Are you sure you want to delete this skill group?'
          onClose={closeDeleteModal}
          onConfirm={handleDelete}
        />
      }
    >
      {skillPage}
    </CrudPageLayout>
  );
};

export default SkillsPage;
