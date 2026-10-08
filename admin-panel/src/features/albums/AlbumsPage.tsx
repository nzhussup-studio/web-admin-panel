import { useMemo, useState } from "react";
import Button from "@/components/ui/button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import { queryKeys, useResourceEditor } from "@/api";
import { PageContainer } from "@/components/layout/page-container";
import { AlbumCard, AlbumForm } from "./components";
import type { image_service_model_AlbumType } from "@/api";
import { FormDrawer } from "@/components/ui/form-drawer";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { createAlbum, deleteAlbum, listAlbums, updateAlbum } from "./api";
import { normalizeAlbumPreview, type AlbumPreviewView } from "./albumData";

const AlbumsPage = () => {
  const [visibility, setVisibility] = useState("all");
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
  } = useResourceEditor<AlbumPreviewView, AlbumPreviewView, string>({
    queryKey: queryKeys.albums.list("all"),
    loadItems: async () => (await listAlbums()).map(normalizeAlbumPreview),
    createItem: createAlbum,
    updateItem: updateAlbum,
    deleteItem: deleteAlbum,
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

  const visibleAlbums = useMemo(
    () =>
      visibility === "all"
        ? albums
        : albums.filter((album) => album.type === visibility),
    [albums, visibility],
  );

  const albumForm = (
    <FormDrawer
      closePopup={closePopup}
      title={isEditMode ? "Edit Album" : "Add Album"}
      onSubmit={saveItem}
    >
      <AlbumForm value={formData} onChange={setFormData} />
    </FormDrawer>
  );

  const albumsPreviewPage = (
    <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
      {visibleAlbums.map((album) => (
        <div key={album.id} className="col">
          <AlbumCard
            album={album}
            onEdit={() => openPopup(album)}
            onDelete={() => confirmDelete(album.id ?? null)}
          />
        </div>
      ))}
    </div>
  );

  return (
    <PageContainer
      title="Albums"
      description="Organize image collections and control their visibility."
      toggleSort={toggleSort}
      loading={loading}
      error={error}
      isEmpty={visibleAlbums.length === 0}
      showAddButton={!error && !showPopup}
      onAdd={() => openPopup()}
      addLabel="Create album"
      addInToolbar
      topContent={
        <ButtonGroup className="album-filters">
          {["all", "public", "semi-public", "private"].map((type) => (
            <Button
              key={type}
              variant={visibility === type ? "primary" : "outline-secondary"}
              onClick={() => setVisibility(type)}
              className="text-capitalize"
            >
              {type === "semi-public" ? "Semi-public" : type}
            </Button>
          ))}
        </ButtonGroup>
      }
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
    </PageContainer>
  );
};
export default AlbumsPage;
