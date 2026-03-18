import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Container from "react-bootstrap/Container";
import Stack from "react-bootstrap/Stack";
import Header from "@/components/layout/Header";
import PageState from "@/components/pages/PageState";
import {
  AlbumService,
  ImageService,
  type image_service_model_Album,
  type image_service_model_Image,
} from "@/lib/api/client";
import { normalizeApiError } from "@/lib/api/errors";
import { usePopup } from "@/hooks/shared/usePopup";
import Popup from "@/components/shared/Popup";
import DeleteConfirmation from "@/components/shared/DeleteConfirmationDialog";
import FramedImageCard from "@/components/albums/FramedImageCard";
import ImageFormInput from "@/components/shared/ImageFormInput";
import FormInput from "@/components/shared/FormInput";
import config from "@/config/app-config";
import { useGlobalAlert } from "@/hooks/alerts/useGlobalAlert";
import { BackCircleIcon, FunnelIcon } from "@/assets/icons";

type ImagePreview = { file: Blob; preview: string };

const AlbumPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
    <Popup
      closePopup={closePopup}
      title={isEditMode ? "Edit Image" : "Add Image"}
      onSubmit={saveImage}
    >
      <ImageFormInput
        value={formData.file}
        onChange={(files) => setFormData({ ...formData, file: files })}
        required={true}
      />
    </Popup>
  );

  const imageForm = (
    <Popup
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
    </Popup>
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
  );

  return (
    <>
      <Header text={album ? "Album " + album.title : "Album"} />

      <Container className='my-5'>
        <Stack
          direction='horizontal'
          gap={3}
          className='align-items-center justify-content-between flex-wrap mb-4'
        >
          <Button
            variant='outline-secondary'
            className='d-inline-flex align-items-center gap-2'
            onClick={() => navigate(-1)}
          >
            <BackCircleIcon width={16} height={16} />
            Back
          </Button>
          <ButtonGroup className='ms-auto'>
            <Button
              variant='outline-primary'
              className='d-inline-flex align-items-center gap-2'
              onClick={toggleSort}
            >
              <FunnelIcon width={16} height={16} />
              Sort
            </Button>
            {!error && !showPopup ? (
              <Button variant='primary' onClick={() => openPopup()}>
                Add Image
              </Button>
            ) : null}
          </ButtonGroup>
        </Stack>
        <PageState
          isEmpty={(album?.images || []).length === 0}
          loading={showLoading}
          error={error}
        >
          {albumImagesSection}
        </PageState>
      </Container>

      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />

      {renderForm()}
    </>
  );
};
export default AlbumPage;
