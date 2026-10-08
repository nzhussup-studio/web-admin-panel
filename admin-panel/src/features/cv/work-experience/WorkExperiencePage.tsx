import React from "react";
import { useNavigate } from "react-router-dom";
import { queryKeys, useResourceEditor } from "@/api";
import Container from "react-bootstrap/Container";
import { MapPin } from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { FormDrawer } from "@/components/ui/form-drawer";
import type { base_service_WorkExperience } from "@/api";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { CvSectionNav } from "../components";
import { OverflowMenu } from "@/components/ui/overflow-menu";
import { DataTable, DataTableMobileCard } from "@/components/ui/data-table";
import {
  createWorkExperience,
  deleteWorkExperience,
  listWorkExperience,
  updateWorkExperience,
} from "../api";
import { ResourceForm } from "@/components/ui/resource-form";
import { ColorPills } from "@/components/ui/color-pills";
import { workExperienceFormFields } from "./workExperienceData";

const WorkExperiencePage = () => {
  const navigate = useNavigate();
  const {
    items: workExperience,
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
  } = useResourceEditor<
    base_service_WorkExperience,
    base_service_WorkExperience,
    number
  >({
    queryKey: queryKeys.cv.workExperience,
    loadItems: listWorkExperience,
    createItem: createWorkExperience,
    updateItem: updateWorkExperience,
    deleteItem: deleteWorkExperience,
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
      }) as base_service_WorkExperience,
  });

  const wexForm = (
    <FormDrawer
      closePopup={closePopup}
      title={isEditMode ? "Edit Work Experience" : "Add Work Experience"}
      onSubmit={saveItem}
    >
      <ResourceForm
        fields={workExperienceFormFields}
        value={formData}
        onChange={setFormData}
      />
    </FormDrawer>
  );

  const wexPage = (
    <DataTable
      className="cv-data-table"
      columns={[
        { key: "position", label: "Position", width: "20%" },
        { key: "company", label: "Company", width: "16%" },
        { key: "period", label: "Period", width: "22%" },
        { key: "stack", label: "Tech stack", width: "24%" },
        { key: "order", label: "Order", width: "8%", sortable: true },
        { key: "actions", label: "Actions", width: "10%", align: "end" },
      ]}
      sortDirection={isAscending ? "asc" : "desc"}
      onSort={toggleSort}
    >
      {workExperience.map((experience) => (
        <tr key={experience.id} onClick={() => openPopup(experience)}>
          <DataTableMobileCard
            colSpan={6}
            title={experience.position}
            subtitle={experience.company}
            metadata={[
              {
                label: "Period",
                value: `${experience.startDate} – ${experience.endDate || "Present"}`,
              },
              ...(experience.location
                ? [{ label: "Location", value: experience.location }]
                : []),
              { label: "Order", value: experience.displayOrder },
            ]}
            actions={
              <OverflowMenu
                label={`Actions for ${experience.position}`}
                onEdit={() => openPopup(experience)}
                onDelete={() => confirmDelete(experience.id ?? null)}
              />
            }
          >
            <ColorPills values={experience.techStack} />
          </DataTableMobileCard>
          <td
            data-label="Position"
            className="fw-semibold text-primary desktop-data-cell"
          >
            {experience.position}
          </td>
          <td className="desktop-data-cell" data-label="Company">
            {experience.company}
          </td>
          <td className="desktop-data-cell" data-label="Period">
            <div>
              {experience.startDate} – {experience.endDate || "Present"}
            </div>
            {experience.location ? (
              <small className="text-secondary d-flex align-items-center gap-1">
                <MapPin size={13} />
                {experience.location}
              </small>
            ) : null}
          </td>
          <td className="desktop-data-cell" data-label="Tech stack">
            <ColorPills values={experience.techStack} />
          </td>
          <td className="desktop-data-cell" data-label="Order">
            {experience.displayOrder}
          </td>
          <td
            data-label="Actions"
            className="text-end desktop-data-cell"
            onClick={(event) => event.stopPropagation()}
          >
            <OverflowMenu
              label={`Actions for ${experience.position}`}
              onEdit={() => openPopup(experience)}
              onDelete={() => confirmDelete(experience.id ?? null)}
            />
          </td>
        </tr>
      ))}
    </DataTable>
  );

  return (
    <PageContainer
      title="Work Experience"
      breadcrumbs={[
        { label: "Overview", to: "/" },
        { label: "CV", to: "/cv" },
        { label: "Work experience" },
      ]}
      description="Manage your professional experience. Add, edit, reorder and control visibility."
      afterHeader={
        <Container fluid="xl">
          <CvSectionNav />
        </Container>
      }
      toggleSort={toggleSort}
      showSort={false}
      loading={loading}
      error={error}
      isEmpty={workExperience.length === 0}
      showAddButton={!error && !showPopup}
      onAdd={() => openPopup()}
      addLabel="Add experience"
      onPreview={() => navigate("/cv/work-experience/preview")}
      modal={showPopup ? wexForm : null}
      deleteDialog={
        <ConfirmDialog
          isOpen={isDeleteModalOpen}
          title="Delete Work Experience"
          message="Are you sure you want to delete this work experience entry?"
          onClose={closeDeleteModal}
          onConfirm={handleDelete}
        />
      }
    >
      {wexPage}
    </PageContainer>
  );
};

export default WorkExperiencePage;
