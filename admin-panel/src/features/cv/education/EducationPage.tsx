import React from "react";
import { useNavigate } from "react-router-dom";
import { queryKeys, useResourceEditor } from "@/api";
import Container from "react-bootstrap/Container";
import { PageContainer } from "@/components/layout/page-container";
import { FormDrawer } from "@/components/ui/form-drawer";
import type { base_service_Education } from "@/api";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { CvSectionNav } from "../components";
import {
  createEducation,
  deleteEducation,
  listEducation,
  updateEducation,
} from "../api";
import { DataTable, DataTableMobileCard } from "@/components/ui/data-table";
import { OverflowMenu } from "@/components/ui/overflow-menu";
import {
  ResourceForm,
  type ResourceFormField,
} from "@/components/ui/resource-form";

const formatDateForInput = (dateString?: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

const educationFormFields: ResourceFormField<base_service_Education>[] = [
  { key: "institution", label: "Institution", required: true },
  { key: "location", label: "Location", required: true },
  {
    key: "startDate",
    label: "Start date",
    type: "date",
    required: true,
    format: (value) => formatDateForInput(value as string | undefined),
  },
  {
    key: "endDate",
    label: "End date",
    type: "date",
    format: (value) => formatDateForInput(value as string | undefined),
  },
  { key: "degree", label: "Degree", required: true },
  { key: "thesis", label: "Thesis" },
  { key: "description", label: "Description", type: "markdown", rows: 8 },
  {
    key: "displayOrder",
    label: "Display order",
    type: "number",
    required: true,
  },
];

const EducationPage = () => {
  const navigate = useNavigate();
  const {
    items: education,
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
  } = useResourceEditor<base_service_Education, base_service_Education, number>(
    {
      queryKey: queryKeys.cv.education,
      loadItems: listEducation,
      createItem: createEducation,
      updateItem: updateEducation,
      deleteItem: deleteEducation,
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
        }) as base_service_Education,
    },
  );

  const eduForm = (
    <FormDrawer
      closePopup={closePopup}
      title={isEditMode ? "Edit Education" : "Add Education"}
      onSubmit={saveItem}
    >
      <ResourceForm
        fields={educationFormFields}
        value={formData}
        onChange={setFormData}
      />
    </FormDrawer>
  );

  const eduPage = (
    <DataTable
      className="cv-data-table"
      columns={[
        { key: "degree", label: "Degree", width: "28%" },
        { key: "institution", label: "Institution", width: "28%" },
        { key: "period", label: "Period", width: "24%" },
        { key: "order", label: "Order", width: "8%", sortable: true },
        { key: "actions", label: "Actions", width: "12%", align: "end" },
      ]}
      sortDirection={isAscending ? "asc" : "desc"}
      onSort={toggleSort}
    >
      {education.map((edu) => (
        <tr key={edu.id} onClick={() => openPopup(edu)}>
          <DataTableMobileCard
            colSpan={5}
            title={edu.degree}
            subtitle={edu.institution}
            metadata={[
              ...(edu.location
                ? [{ label: "Location", value: edu.location }]
                : []),
              {
                label: "Period",
                value: `${edu.startDate ? new Date(edu.startDate).toLocaleDateString() : "Unknown"} – ${edu.endDate ? new Date(edu.endDate).toLocaleDateString() : "Present"}`,
              },
              { label: "Order", value: edu.displayOrder },
            ]}
            actions={
              <OverflowMenu
                label={`Actions for ${edu.degree}`}
                onEdit={() => openPopup(edu)}
                onDelete={() => confirmDelete(edu.id ?? null)}
              />
            }
          />
          <td
            data-label="Degree"
            className="fw-semibold text-primary desktop-data-cell"
          >
            {edu.degree}
          </td>
          <td className="desktop-data-cell" data-label="Institution">
            <div>{edu.institution}</div>
            {edu.location ? (
              <small className="text-secondary">{edu.location}</small>
            ) : null}
          </td>
          <td className="desktop-data-cell" data-label="Period">
            {edu.startDate
              ? new Date(edu.startDate).toLocaleDateString()
              : "Unknown"}{" "}
            –{" "}
            {edu.endDate
              ? new Date(edu.endDate).toLocaleDateString()
              : "Present"}
          </td>
          <td className="desktop-data-cell" data-label="Order">
            {edu.displayOrder}
          </td>
          <td
            data-label="Actions"
            className="text-end desktop-data-cell"
            onClick={(event) => event.stopPropagation()}
          >
            <OverflowMenu
              label={`Actions for ${edu.degree}`}
              onEdit={() => openPopup(edu)}
              onDelete={() => confirmDelete(edu.id ?? null)}
            />
          </td>
        </tr>
      ))}
    </DataTable>
  );

  return (
    <PageContainer
      title="Education"
      breadcrumbs={[
        { label: "Overview", to: "/" },
        { label: "CV", to: "/cv" },
        { label: "Education" },
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
      isEmpty={education.length === 0}
      showAddButton={!error && !showPopup}
      onAdd={() => openPopup()}
      onPreview={() => navigate("/cv/education/preview")}
      modal={showPopup ? eduForm : null}
      deleteDialog={
        <ConfirmDialog
          isOpen={isDeleteModalOpen}
          title="Delete Education"
          message="Are you sure you want to delete this education entry?"
          onClose={closeDeleteModal}
          onConfirm={handleDelete}
        />
      }
    >
      {eduPage}
    </PageContainer>
  );
};

export default EducationPage;
