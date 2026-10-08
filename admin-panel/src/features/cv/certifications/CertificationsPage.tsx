import React from "react";
import { queryKeys, useResourceEditor } from "@/api";
import Button from "@/components/ui/button";
import Container from "react-bootstrap/Container";
import { PageContainer } from "@/components/layout/page-container";
import { FormDrawer as Popup } from "@/components/ui/form-drawer";
import type { base_service_Certificate } from "@/api";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { CvSectionNav } from "../components";
import {
  createCertification,
  deleteCertification,
  listCertifications,
  updateCertification,
} from "../api";
import { DataTable } from "@/components/ui/data-table";
import { OverflowMenu } from "@/components/ui/overflow-menu";
import {
  ResourceForm,
  type ResourceFormField,
} from "@/components/ui/resource-form";

const certificationFormFields: ResourceFormField<base_service_Certificate>[] = [
  { key: "name", label: "Certificate name", required: true },
  { key: "url", label: "Certificate URL", type: "url", required: true },
  { key: "issuer", label: "Issuer" },
  {
    key: "displayOrder",
    label: "Display order",
    type: "number",
    required: true,
  },
];

const CertificationsPage = () => {
  const {
    items: certificates,
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
    base_service_Certificate,
    base_service_Certificate,
    number
  >({
    queryKey: queryKeys.cv.certifications,
    loadItems: listCertifications,
    createItem: createCertification,
    updateItem: updateCertification,
    deleteItem: deleteCertification,
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
      }) as base_service_Certificate,
  });

  const certForm = (
    <Popup
      closePopup={closePopup}
      title={isEditMode ? "Edit Certificate" : "Add Certificate"}
      onSubmit={saveItem}
    >
      <ResourceForm
        fields={certificationFormFields}
        value={formData}
        onChange={setFormData}
      />
    </Popup>
  );

  const certPage = (
    <DataTable
      className="cv-data-table"
      columns={[
        { key: "certificate", label: "Certificate", width: "40%" },
        { key: "issuer", label: "Issuer", width: "40%" },
        { key: "order", label: "Order", width: "8%", sortable: true },
        { key: "actions", label: "Actions", width: "12%", align: "end" },
      ]}
      sortDirection={isAscending ? "asc" : "desc"}
      onSort={toggleSort}
    >
      {certificates.map((certificate) => (
        <tr key={certificate.id} onClick={() => openPopup(certificate)}>
          <td data-label="Certificate">
            <div className="fw-semibold text-primary">{certificate.name}</div>
            {certificate.url ? (
              <Button
                variant="link"
                className="p-0 small text-secondary"
                href={certificate.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => event.stopPropagation()}
              >
                {certificate.url.replace(/^https?:\/\//, "")}
              </Button>
            ) : null}
          </td>
          <td data-label="Issuer">{certificate.issuer || "—"}</td>
          <td data-label="Order">{certificate.displayOrder}</td>
          <td
            data-label="Actions"
            className="text-end"
            onClick={(event) => event.stopPropagation()}
          >
            <OverflowMenu
              label={`Actions for ${certificate.name}`}
              onEdit={() => openPopup(certificate)}
              onDelete={() => confirmDelete(certificate.id ?? null)}
            />
          </td>
        </tr>
      ))}
    </DataTable>
  );

  return (
    <PageContainer
      title="Certifications"
      breadcrumbs={[
        { label: "Overview", to: "/" },
        { label: "CV", to: "/cv" },
        { label: "Certifications" },
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
      isEmpty={certificates.length === 0}
      showAddButton={!error && !showPopup}
      onAdd={() => openPopup()}
      modal={showPopup ? certForm : null}
      deleteDialog={
        <ConfirmDialog
          isOpen={isDeleteModalOpen}
          title="Delete Certificate"
          message="Are you sure you want to delete this certificate?"
          onClose={closeDeleteModal}
          onConfirm={handleDelete}
        />
      }
    >
      {certPage}
    </PageContainer>
  );
};

export default CertificationsPage;
