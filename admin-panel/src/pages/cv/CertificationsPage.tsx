import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import CrudPageLayout from "@/components/pages/CrudPageLayout";
import Popup from "@/components/shared/Popup";
import FormInput from "@/components/shared/FormInput";
import {
  CertificateControllerService,
  type base_service_Certificate,
} from "@/lib/api/client";
import { useCrudPage } from "@/hooks/crud/useCrudPage";
import DeleteConfirmation from "@/components/shared/DeleteConfirmationDialog";

const CertificationsPage = () => {
  const {
    items: certificates,
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
  } = useCrudPage<base_service_Certificate, base_service_Certificate, number>({
    loadItems: () => CertificateControllerService.listCertificate(),
    createItem: (payload) => CertificateControllerService.createCertificate(payload),
    updateItem: (payload) => CertificateControllerService.updateCertificate(payload),
    deleteItem: (id) => CertificateControllerService.deleteCertificate({ id }),
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
      }) as base_service_Certificate,
  });

  const certForm = (
    <Popup
      closePopup={closePopup}
      title={isEditMode ? "Edit Certificate" : "Add Certificate"}
      onSubmit={saveItem}
    >
      <FormInput
        label='Certificate Name'
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required={true}
      />
      <FormInput
        label='Certificate URL'
        value={formData.url}
        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
        required={true}
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

  const certPage = (
    <div className='d-grid gap-3'>
      {certificates.map((certificate) => (
        <Card
          key={certificate.id}
          className='rounded-4 app-interactive-card app-resource-card'
          onClick={() => openPopup(certificate)}
        >
          <Card.Body className='p-4 app-card-body'>
            <div className='d-flex justify-content-between align-items-start gap-3'>
              <div>
                <Card.Title className='fw-semibold mb-3 app-card-title'>
                  {certificate.name}
                </Card.Title>
                <div className='d-flex flex-wrap align-items-center gap-3'>
                  {certificate.url && (
                    <Button
                      variant='link'
                      className='p-0'
                      href={certificate.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Certificate
                    </Button>
                  )}
                  <span className='text-secondary'>
                    Order: {certificate.displayOrder}
                  </span>
                </div>
              </div>
              <div className='app-card-actions'>
                <Button
                  variant='outline-primary'
                  size='sm'
                  onClick={(e) => {
                    e.stopPropagation();
                    openPopup(certificate);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant='outline-danger'
                  size='sm'
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmDelete(certificate.id ?? null);
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
      title='Certifications'
      toggleSort={toggleSort}
      loading={loading}
      error={error}
      isEmpty={certificates.length === 0}
      showAddButton={!error && !showPopup}
      onAdd={() => openPopup()}
      modal={showPopup ? certForm : null}
      deleteDialog={
        <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
      />
      }
    >
      {certPage}
    </CrudPageLayout>
  );
};

export default CertificationsPage;
