import React from "react";
import CrudPageLayout from "@/components/pages/CrudPageLayout";
import EditableAlbumCard from "@/components/albums/EditableAlbumCard";
import {
  AlbumService,
  type image_service_model_AlbumType,
  type image_service_model_AlbumPreview,
} from "@/lib/api/client";
import { useCrudPage } from "@/hooks/crud/useCrudPage";
import Popup from "@/components/shared/Popup";
import FormInput from "@/components/shared/FormInput";
import DeleteConfirmation from "@/components/shared/DeleteConfirmationDialog";

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
  const {
    items: albums,
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
  } = useCrudPage<AlbumPreviewView, AlbumPreviewView, string>({
    loadItems: async () => {
      const response = await AlbumService.getV1Album("all");
      return (response.data || []).map(normalizeAlbumPreview);
    },
    createItem: (payload) =>
      AlbumService.postV1Album(payload as image_service_model_AlbumPreview),
    updateItem: (payload) =>
      AlbumService.putV1Album(
        String(payload.id),
        payload as image_service_model_AlbumPreview
      ),
    deleteItem: (id) => AlbumService.deleteV1Album(id),
    getItemId: (item) => item.id ?? null,
    sortItems: (items, isAscending) =>
      items.sort((a, b) => {
        const sortA = a.date ? new Date(a.date).getTime() : 0;
        const sortB = b.date ? new Date(b.date).getTime() : 0;
        return isAscending ? sortA - sortB : sortB - sortA;
      }),
    toPayload: (data) =>
      ({
        ...data,
        type: data.type as image_service_model_AlbumType,
      }) as AlbumPreviewView,
  });

  const albumForm = (
    <Popup
      closePopup={closePopup}
      title={isEditMode ? "Edit Album" : "Add Album"}
      onSubmit={saveItem}
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
        onChange={(e) =>
          setFormData({
            ...formData,
            type: e.target.value as image_service_model_AlbumType,
          })
        }
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
    </Popup>
  );

  const albumsPreviewPage = (
    <div className='row row-cols-1 row-cols-md-2 g-4'>
      {albums.map((album) => (
        <div key={album.id} className='col'>
          <EditableAlbumCard
            album={album}
            onEdit={() => openPopup(album)}
            onDelete={() => confirmDelete(album.id ?? null)}
          />
        </div>
      ))}
    </div>
  );

  return (
    <CrudPageLayout
      title='Album Management'
      toggleSort={toggleSort}
      loading={loading}
      error={error}
      isEmpty={albums.length === 0}
      showAddButton={!error && !showPopup}
      onAdd={() => openPopup()}
      topContent={<br />}
      modal={showPopup ? albumForm : null}
      deleteDialog={
        <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
      />
      }
    >
      {albumsPreviewPage}
    </CrudPageLayout>
  );
};
export default AlbumsPage;
