import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import CrudPageLayout from "@/components/pages/CrudPageLayout";
import EditableAlbumCard from "@/components/albums/EditableAlbumCard";
import {
  AlbumService,
  type image_service_model_AlbumType,
  type image_service_model_AlbumPreview,
} from "@/lib/api/client";
import { useCrudPage } from "@/hooks/crud/useCrudPage";
import Popup from "@/components/shared/Popup";
import ConfirmDialog from "@/components/shared/ConfirmDialog";

type AlbumPreviewView = image_service_model_AlbumPreview & {
  description?: string;
  images_count?: number;
};

const normalizeAlbumPreview = (
  album: image_service_model_AlbumPreview,
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
        payload as image_service_model_AlbumPreview,
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
      <Form.Group className="mb-3">
        <Form.Label>Album Title</Form.Label>
        <Form.Control
          value={formData.title ?? ""}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Album Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={formData.desc ?? ""}
          onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Date</Form.Label>
        <Form.Control
          type="date"
          value={formData.date ?? ""}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Type</Form.Label>
        <Form.Select
          value={formData.type ?? ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              type: e.target.value as image_service_model_AlbumType,
            })
          }
        >
          <option value="">Select album visibility</option>
          <option value="private">private</option>
          <option value="semi-public">semi-public</option>
          <option value="public">public</option>
        </Form.Select>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Image Preview URL</Form.Label>
        <InputGroup>
          <Form.Control
            value={formData.preview_image ?? ""}
            onChange={(e) =>
              setFormData({ ...formData, preview_image: e.target.value })
            }
          />
          <Button
            variant="outline-secondary"
            onClick={() => setFormData({ ...formData, preview_image: "" })}
            disabled={!formData.preview_image}
          >
            Clear
          </Button>
        </InputGroup>
      </Form.Group>
    </Popup>
  );

  const albumsPreviewPage = (
    <div className="row row-cols-1 row-cols-md-2 g-4">
      {albums.map((album) => (
        <div key={album.id} className="col">
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
      title="Album Management"
      toggleSort={toggleSort}
      loading={loading}
      error={error}
      isEmpty={albums.length === 0}
      showAddButton={!error && !showPopup}
      onAdd={() => openPopup()}
      topContent={<br />}
      modal={showPopup ? albumForm : null}
      deleteDialog={
        <ConfirmDialog
          isOpen={isDeleteModalOpen}
          title="Delete Album"
          message="Are you sure you want to delete this album?"
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
