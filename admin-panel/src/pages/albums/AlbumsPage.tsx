import React, { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import EditableAlbumCard from "@/components/albums/EditableAlbumCard";
import {
  AlbumService,
  type image_service_model_AlbumType,
  type image_service_model_AlbumPreview,
} from "@/lib/api/client";
import { normalizeApiError } from "@/lib/api/errors";
import { usePopup } from "@/hooks/shared/usePopup";
import { useRenderPage } from "@/hooks/shared/useRenderPage";
import AddButton from "@/components/shared/AddButton";
import PopUp from "@/components/shared/Popup";
import FormInput from "@/components/shared/FormInput";

import PageSubHeader from "@/components/shared/PageSubHeader";
import DeleteConfirmation from "@/components/shared/DeleteConfirmationDialog";
import PageWrapper from "@/motion/PageTransition";
import LoadingElement from "@/components/states/LoadingState";
import ErrorElement from "@/components/states/InternalServerErrorState";
import NoInfoFoundElement from "@/components/states/EmptyState";

type AlbumPreviewView = image_service_model_AlbumPreview & {
  description?: string;
  images_count?: number;
};

const normalizeAlbumPreview = (
  album: image_service_model_AlbumPreview
): AlbumPreviewView => ({
  ...album,
  description: album.desc,
  images_count: album.image_count,
});

const AlbumsPage = () => {
  const [albums, setAlbums] = useState<AlbumPreviewView[]>([]);
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
  } = usePopup<AlbumPreviewView>();

  const fetchAlbums = async () => {
    setShowLoading(true);
    setError(null);
    try {
      const response = await AlbumService.getV1Album("all");
      const fetchedAlbums = (response.data || []).map(normalizeAlbumPreview);
      const sortedAlbums = [...fetchedAlbums].sort((a, b) => {
        const sortA = a.date ? new Date(a.date).getTime() : 0;
        const sortB = b.date ? new Date(b.date).getTime() : 0;
        return isAscending ? sortA - sortB : sortB - sortA;
      });
      setAlbums(sortedAlbums);
    } catch (fetchError) {
      setError(normalizeApiError(fetchError));
    } finally {
      setShowLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, [isAscending]);

  const saveAlbum = async () => {
    const payload = {
      ...formData,
      type: formData.type as image_service_model_AlbumType,
    } as image_service_model_AlbumPreview;
    if (isEditMode && payload.id) {
      await AlbumService.putV1Album(String(payload.id), payload);
    } else {
      await AlbumService.postV1Album(payload);
    }
    await fetchAlbums();
    closePopup();
  };

  const confirmDelete = (itemId?: string) => {
    setSelectedItemId(itemId ?? null);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedItemId) return;
    try {
      await AlbumService.deleteV1Album(selectedItemId);
      setDeleteModalOpen(false);
      setSelectedItemId(null);
      await fetchAlbums();
    } catch (deleteError) {
      setError(normalizeApiError(deleteError));
    }
  };

  const toggleSort = () => {
    setIsAscending((prev) => !prev);
  };

  const { renderPage } = useRenderPage(albums, showLoading, error);

  const albumForm = (
    <PopUp
      closePopup={closePopup}
      title={isEditMode ? "Edit Album" : "Add Album"}
      onSubmit={saveAlbum}
    >
      <FormInput
        label='Album Title'
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required={true}
      />
      <FormInput
        label='Album Description'
        type='textarea'
        value={formData.desc}
        onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
        required={false}
      />
      <FormInput
        label='Date'
        type='date'
        value={formData.date}
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        required={false}
      />
      <FormInput
        label='Type'
        type='select'
        value={formData.type}
        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        options={["private", "semi-public", "public"]}
        required={false}
      />
      <FormInput
        label='Image Preview URL'
        type='clearable_text'
        value={formData.preview_image}
        onChange={(e) =>
          setFormData({ ...formData, preview_image: e.target.value })
        }
        required={false}
      />
    </PopUp>
  );

  const albumsPreviewPage = (
    <PageWrapper>
      <div className='row row-cols-1 row-cols-md-2 g-4'>
        {albums.map((album) => (
          <div key={album.id} className='col'>
            <EditableAlbumCard
              album={album}
              onEdit={() => openPopup(album)}
              onDelete={() => confirmDelete(album.id)}
            />
          </div>
        ))}
      </div>
    </PageWrapper>
  );

  return (
    <>
      <Header text={"Album Management"} />
      <div className='container my-5'>
        <PageSubHeader toggleSort={toggleSort} />
        <br />
        {renderPage(
          ErrorElement,
          LoadingElement,
          NoInfoFoundElement,
          albumsPreviewPage
        )}
      </div>

      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />

      {showPopup && albumForm}
      {!error && !showPopup && <AddButton openPopup={openPopup} />}
    </>
  );
};
export default AlbumsPage;
