import React from "react";
import { queryKeys, useResourceEditor } from "@/api";
import Container from "react-bootstrap/Container";
import { PageContainer } from "@/components/layout/page-container";
import { FormDrawer } from "@/components/ui/form-drawer";
import type { base_service_Skill } from "@/api";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { CvSectionNav } from "../components";
import { createSkill, deleteSkill, listSkills, updateSkill } from "../api";
import { DataTable } from "@/components/ui/data-table";
import { OverflowMenu } from "@/components/ui/overflow-menu";
import {
  ResourceForm,
  type ResourceFormField,
} from "@/components/ui/resource-form";
import { ColorPills } from "@/components/ui/color-pills";

const skillFormFields: ResourceFormField<base_service_Skill>[] = [
  { key: "category", label: "Category", required: true },
  { key: "skillNames", label: "Skill names (comma-separated)", required: true },
  {
    key: "displayOrder",
    label: "Display order",
    type: "number",
    required: true,
  },
];

const SkillsPage = () => {
  const {
    items: skills,
    loading,
    error,
    isAscending,
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
  } = useResourceEditor<base_service_Skill, base_service_Skill, number>({
    queryKey: queryKeys.cv.skills,
    loadItems: listSkills,
    createItem: createSkill,
    updateItem: updateSkill,
    deleteItem: deleteSkill,
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
      }) as base_service_Skill,
  });

  const skillForm = (
    <FormDrawer
      closePopup={closePopup}
      title={isEditMode ? "Edit Skill" : "Add Skill"}
      onSubmit={saveItem}
    >
      <ResourceForm
        fields={skillFormFields}
        value={formData}
        onChange={setFormData}
      />
    </FormDrawer>
  );

  const skillPage = (
    <DataTable
      className="cv-data-table"
      columns={[
        { key: "category", label: "Category", width: "25%" },
        { key: "skills", label: "Skills", width: "55%" },
        { key: "order", label: "Order", width: "8%", sortable: true },
        { key: "actions", label: "Actions", width: "12%", align: "end" },
      ]}
      sortDirection={isAscending ? "asc" : "desc"}
      onSort={toggleSort}
    >
      {skills.map((skill) => (
        <tr key={skill.id} onClick={() => openPopup(skill)}>
          <td data-label="Category" className="fw-semibold text-primary">
            {skill.category}
          </td>
          <td data-label="Skills">
            <ColorPills values={skill.skillNames} />
          </td>
          <td data-label="Order">{skill.displayOrder}</td>
          <td
            data-label="Actions"
            className="text-end"
            onClick={(event) => event.stopPropagation()}
          >
            <OverflowMenu
              label={`Actions for ${skill.category}`}
              onEdit={() => openPopup(skill)}
              onDelete={() => confirmDelete(skill.id ?? null)}
            />
          </td>
        </tr>
      ))}
    </DataTable>
  );

  return (
    <PageContainer
      title="Skills"
      breadcrumbs={[
        { label: "Overview", to: "/" },
        { label: "CV", to: "/cv" },
        { label: "Skills" },
      ]}
      afterHeader={
        <Container fluid="xl">
          <CvSectionNav />
        </Container>
      }
      toggleSort={toggleSort}
      showSort={false}
      loading={loading}
      error={error}
      isEmpty={skills.length === 0}
      showAddButton={!error && !showPopup}
      onAdd={() => openPopup()}
      modal={showPopup ? skillForm : null}
      deleteDialog={
        <ConfirmDialog
          isOpen={isDeleteModalOpen}
          title="Delete Skill Group"
          message="Are you sure you want to delete this skill group?"
          onClose={closeDeleteModal}
          onConfirm={handleDelete}
        />
      }
    >
      {skillPage}
    </PageContainer>
  );
};

export default SkillsPage;
