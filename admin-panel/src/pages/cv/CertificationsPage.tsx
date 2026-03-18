import React, { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import EditableCard from "@/components/shared/EditableCard";
import AddButton from "@/components/shared/AddButton";
import PopUp from "@/components/shared/Popup";
import FormInput from "@/components/shared/FormInput";
import PageSubHeader from "@/components/shared/PageSubHeader";
import {
  CertificateControllerService,
  type base_service_Certificate,
} from "@/lib/api/client";
import { normalizeApiError } from "@/lib/api/errors";
import { usePopup } from "@/hooks/shared/usePopup";
import { useRenderPage } from "@/hooks/shared/useRenderPage";
import DeleteConfirmation from "@/components/shared/DeleteConfirmationDialog";
import PageWrapper from "@/motion/PageTransition";
import LoadingElement from "@/components/states/LoadingState";
import ErrorElement from "@/components/states/ErrorState";
import NoInfoFoundElement from "@/components/states/EmptyState";

const Certs = () => {
  const [certificates, setCertificates] = useState<base_service_Certificate[]>(
    []
  );
  const [isAscending, setIsAscending] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [showLoading, setShowLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const {
    showPopup,
    formData,
    isEditMode,
    openPopup,
    closePopup,
    setFormData,
  } = usePopup<base_service_Certificate>();

  const fetchCertificates = async () => {
    setShowLoading(true);
    setError(null);
    try {
      const fetchedCertificates =
        await CertificateControllerService.listCertificate();
      const sortedCertificates = [...fetchedCertificates].sort((a, b) =>
        isAscending
          ? Number(a.displayOrder) - Number(b.displayOrder)
          : Number(b.displayOrder) - Number(a.displayOrder)
      );
      setCertificates(sortedCertificates as base_service_Certificate[]);
    } catch (fetchError) {
      setError(normalizeApiError(fetchError));
    } finally {
      setShowLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, [isAscending]);

  const saveCertificate = async () => {
    const payload = {
      ...formData,
      displayOrder: Number(formData.displayOrder),
    } as base_service_Certificate;
    if (isEditMode) {
      await CertificateControllerService.updateCertificate(payload);
    } else {
      await CertificateControllerService.createCertificate(payload);
    }
    await fetchCertificates();
    closePopup();
  };

  const confirmDelete = (itemId?: number) => {
    setSelectedItemId(itemId ?? null);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (selectedItemId == null) return;
    try {
      await CertificateControllerService.deleteCertificate({ id: selectedItemId });
      setDeleteModalOpen(false);
      setSelectedItemId(null);
      await fetchCertificates();
    } catch (deleteError) {
      setError(normalizeApiError(deleteError));
    }
  };

  const toggleSort = () => {
    setIsAscending((prev) => !prev);
  };

  const { renderPage } = useRenderPage(certificates, showLoading, error);

  const certForm = (
    <PopUp
      closePopup={closePopup}
      title={isEditMode ? "Edit Certificate" : "Add Certificate"}
      onSubmit={saveCertificate}
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
          setFormData({ ...formData, displayOrder: e.target.value })
        }
        required={true}
      />
    </PopUp>
  );

  const certPage = (
    <PageWrapper>
      <div className='mt-4'>
        {certificates.map((certificate) => (
          <EditableCard
            key={certificate.id}
            title={certificate.name}
            onEdit={() => openPopup(certificate)}
            onDelete={() => confirmDelete(certificate.id)}
          >
            <div className='mb-3'>
              {certificate.url && (
                <a
                  href={certificate.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='btn btn-link'
                  onClick={(e) => e.stopPropagation()}
                >
                  View Certificate
                </a>
              )}
              <p>Order: {certificate.displayOrder}</p>
            </div>
          </EditableCard>
        ))}
      </div>
    </PageWrapper>
  );

  return (
    <>
      <Header text={"Certifications"} />
      <div className='container my-5'>
        <PageSubHeader toggleSort={toggleSort} />
        {renderPage(ErrorElement, LoadingElement, NoInfoFoundElement, certPage)}
      </div>

      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />

      {showPopup && certForm}
      {!error && !showPopup && <AddButton openPopup={openPopup} />}
    </>
  );
};

export default Certs;
