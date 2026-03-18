import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import {
  AlbumService,
  ImageService,
  type image_service_model_Album,
  type image_service_model_Image,
} from "@/lib/api/client";
import { normalizeApiError } from "@/lib/api/errors";
import { usePopup } from "@/hooks/shared/usePopup";
import { useRenderPage } from "@/hooks/shared/useRenderPage";
import AddButton from "@/components/shared/AddButton";
import PopUp from "@/components/shared/Popup";

import PageSubHeader from "@/components/shared/PageSubHeader";
import DeleteConfirmation from "@/components/shared/DeleteConfirmationDialog";
import PageWrapper from "@/motion/PageTransition";
import LoadingElement from "@/components/states/LoadingState";
import ErrorElement from "@/components/states/ErrorState";
import NoInfoFoundElement from "@/components/states/EmptyState";
import FramedImageCard from "@/components/albums/FramedImageCard";
import ImageFormInput from "@/components/shared/ImageFormInput";
import FormInput from "@/components/shared/FormInput";
import config from "@/config/app-config";
import { useGlobalAlert } from "@/hooks/alerts/useGlobalAlert";

type ImagePreview = { file: Blob; preview: string };

const Album = () => {
  const { id } = useParams();
  const { triggerAlert } = useGlobalAlert();
  const [album, setAlbum] = useState<image_service_model_Album | null>(null);
  const [isAscending, setIsAscending] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [showLoading, setShowLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const {
    showPopup,
    formData,
    isEditMode,
    openPopup,
    closePopup,
    setFormData,
  } = usePopup<image_service_model_Image & { file?: ImagePreview[]; newId?: string }>();

  const fetchItem = async () => {
    if (!id) return;
    setShowLoading(true);
    setError(null);
    try {
      const response = await AlbumService.getV1Album1(id);
      const fetchedAlbum = response.data || null;
      if (fetchedAlbum?.images) {
        fetchedAlbum.images = [...fetchedAlbum.images].sort((a, b) =>
          isAscending
            ? String(a.id || "").localeCompare(String(b.id || ""))
            : String(b.id || "").localeCompare(String(a.id || ""))
        );
      }
      setAlbum(fetchedAlbum);
    } catch (fetchError) {
      setError(normalizeApiError(fetchError));
    } finally {
      setShowLoading(false);
    }
  };

  useEffect(() => {
    fetchItem();
  }, [id, isAscending]);

  const saveImage = async () => {
    if (!id) return;
    for (const file of formData.file || []) {
      await ImageService.postV1AlbumUpload(id, { file: file.file });
    }
    await fetchItem();
    closePopup();
  };

  const albumForm = (
    <PopUp
      closePopup={closePopup}
      title={isEditMode ? "Edit Image" : "Add Image"}
      onSubmit={saveImage}
    >
      <ImageFormInput
        value={formData.file}
        onChange={(files) => setFormData({ ...formData, file: files })}
        required={true}
      />
    </PopUp>
  );

  const imageForm = (
    <PopUp
      closePopup={closePopup}
      title={isEditMode ? "Edit Image" : "Add Image"}
      onSubmit={async () => {
        try {
          if (!id || !formData.id || !formData.newId) return;
          await ImageService.patchV1AlbumRename(
            id,
            String(formData.id),
            String(formData.newId)
          );
          triggerAlert(
            `Successfully changed id to ${formData.newId}`,
            "success"
          );
          closePopup();
        } catch (err) {
          triggerAlert(
            err instanceof Error ? err.message : "An unexpected error occurred",
            "danger"
          );
        } finally {
          await fetchItem();
        }
      }}
    >
      {formData.id}
      <FormInput
        value={formData.newId}
        type='clearable_text'
        onChange={(e) => setFormData({ ...formData, newId: e.target.value })}
        required={true}
      />
    </PopUp>
  );

  const renderForm = () => {
    if (showPopup) {
      if (isEditMode) {
        return imageForm;
      }
      return albumForm;
    }
  };

  const confirmDelete = (itemId?: string) => {
    setSelectedItemId(itemId ?? null);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!id || !selectedItemId) return;
    try {
      await ImageService.deleteV1Album(id, selectedItemId);
      setDeleteModalOpen(false);
      setSelectedItemId(null);
      await fetchItem();
    } catch (deleteError) {
      setError(normalizeApiError(deleteError));
    }
  };

  const toggleSort = () => {
    setIsAscending((prev) => !prev);
  };

  const albumImagesSection = (
    <PageWrapper>
      <div className='row row-cols-2 row-cols-sm-2 row-cols-md-3 g-4'>
        {album?.images?.map((image) => (
          <div key={image.id} className='col'>
            <FramedImageCard
              imageUrl={`${config.apiBase}${image?.url || ""}`}
              alt={image?.id}
              onDelete={() => confirmDelete(image.id)}
              onEdit={() => {
                openPopup(image);
              }}
            />
          </div>
        ))}
      </div>
    </PageWrapper>
  );
  const { renderPage } = useRenderPage(album?.images || [], showLoading, error);

  return (
    <>
      <Header text={album ? "Album " + album.title : "Album"} />

      <div className='container my-5'>
        <PageSubHeader toggleSort={toggleSort} />
        <br />

        {renderPage(
          ErrorElement,
          LoadingElement,
          NoInfoFoundElement,
          albumImagesSection
        )}
      </div>

      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />

      {renderForm()}
      {!error && !showPopup && <AddButton openPopup={openPopup} />}
    </>
  );
};
export default Album;
