import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import CrudPageLayout from "@/components/pages/CrudPageLayout";
import Popup from "@/components/shared/Popup";
import {
  CertificateControllerService,
  type base_service_Certificate,
} from "@/lib/api/client";
import { useCrudPage } from "@/hooks/crud/useCrudPage";
import ConfirmDialog from "@/components/shared/ConfirmDialog";

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
    createItem: (payload) =>
      CertificateControllerService.createCertificate(payload),
    updateItem: (payload) =>
      CertificateControllerService.updateCertificate(payload),
    deleteItem: (id) => CertificateControllerService.deleteCertificate({ id }),
    getItemId: (item) => item.id ?? null,
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
      <Form.Group className="mb-3">
        <Form.Label>Certificate Name</Form.Label>
        <Form.Control
          value={formData.name ?? ""}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Certificate URL</Form.Label>
        <Form.Control
          value={formData.url ?? ""}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Issuer (optional)</Form.Label>
        <Form.Control
          value={formData.issuer ?? ""}
          onChange={(e) =>
            setFormData({ ...formData, issuer: e.target.value })
          }
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Order Display</Form.Label>
        <Form.Control
          type="number"
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

  const certPage = (
    <div className="d-grid gap-3">
      {certificates.map((certificate) => (
        <Card
          key={certificate.id}
          className="rounded-4 app-interactive-card app-resource-card"
          onClick={() => openPopup(certificate)}
        >
          <Card.Body className="p-4 app-card-body">
            <div className="d-flex justify-content-between align-items-start gap-3">
              <div>
                <Card.Title className="fw-semibold mb-3 app-card-title">
                  {certificate.name}
                </Card.Title>
                {certificate.issuer && (
                  <div className="text-secondary mb-2">{certificate.issuer}</div>
                )}
                <div className="d-flex flex-wrap align-items-center gap-3">
                  {certificate.url && (
                    <Button
                      variant="link"
                      className="p-0"
                      href={certificate.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Certificate
                    </Button>
                  )}
                  <span className="text-secondary">
                    Order: {certificate.displayOrder}
                  </span>
                </div>
              </div>
              <div className="app-card-actions">
                <Button
                  variant="outline-danger"
                  size="sm"
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
      title="Certifications"
      toggleSort={toggleSort}
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
    </CrudPageLayout>
  );
};

export default CertificationsPage;
