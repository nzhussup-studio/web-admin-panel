import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Button from "@/components/ui/button";
import Container from "react-bootstrap/Container";
import { PageHeader } from "@/components/layout/page-header";
import { AsyncState } from "@/components/feedback/error-state";
import {
  type image_service_model_Album,
  type image_service_model_AlbumPreview,
  type image_service_model_Image,
} from "@/api";
import { getApiErrorMessage, normalizeApiError } from "@/api";
import { FormDrawer } from "@/components/ui/form-drawer";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  AlbumForm,
  AlbumImageUploadField,
  AlbumLightboxModal,
  AlbumVisibilityBadge,
  ImageMenu,
  RenameImageField,
  type ImagePreview,
  UploadProgress,
} from "./components";
import { useOptionalGlobalAlert } from "@/providers/alerts";
import { queryKeys } from "@/api";
import {
  deleteImage,
  getAlbum,
  getUploadStatus,
  renameImage,
  updateAlbum,
  uploadImages,
} from "./api";
import {
  getAlbumImageUrl,
  normalizeAlbumPreview,
  type AlbumPreviewView,
} from "./albumData";
import { ImagePlus, Pencil } from "lucide-react";

type UploadStatus = {
  jobId: string;
  completed: number;
  total: number;
  status: string;
  error?: string;
};
type AlbumImageFormData = Partial<
  image_service_model_Image & { file?: ImagePreview[]; newId?: string }
>;

const AlbumDetailPage = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { triggerAlert } = useOptionalGlobalAlert();
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadStatus | null>(
    null,
  );
  const [formData, setFormData] = useState<AlbumImageFormData>({});
  const [detailsForm, setDetailsForm] = useState<Partial<AlbumPreviewView>>({});

  const albumQuery = useQuery({
    queryKey: queryKeys.albums.detail(id ?? "missing"),
    queryFn: () => getAlbum(id as string),
    enabled: Boolean(id),
  });
  const album = useMemo(() => {
    if (!albumQuery.data) return null;
    return {
      ...albumQuery.data,
      images: [...(albumQuery.data.images ?? [])],
    } as image_service_model_Album;
  }, [albumQuery.data]);

  useEffect(() => {
    if (!id || !uploadProgress) return;
    if (
      uploadProgress.status !== "queued" &&
      uploadProgress.status !== "processing"
    ) {
      return;
    }

    let cancelled = false;
    const pollUpload = async () => {
      try {
        const response = await getUploadStatus(id, uploadProgress.jobId);
        const status = response.data;
        if (!status || cancelled) return;

        setUploadProgress({
          jobId: uploadProgress.jobId,
          completed: status.completed || 0,
          total: status.total || uploadProgress.total,
          status: status.status || "processing",
          error: status.error,
        });
      } catch (pollError) {
        if (!cancelled) {
          setUploadProgress((current) =>
            current
              ? {
                  ...current,
                  status: "failed",
                  error: getApiErrorMessage(
                    pollError,
                    "Failed to check upload progress",
                  ),
                }
              : current,
          );
        }
      }
    };

    const timer = setTimeout(pollUpload, 1000);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [id, uploadProgress]);

  useEffect(() => {
    if (
      !uploadProgress ||
      (uploadProgress.status !== "completed" &&
        uploadProgress.status !== "failed")
    ) {
      return;
    }

    if (uploadProgress.status === "completed") {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.albums.detail(id ?? "missing"),
      });
      triggerAlert("Images uploaded successfully", "success");
    } else {
      triggerAlert(
        uploadProgress.error || "Upload processing failed",
        "danger",
      );
    }

    const clearProgress = window.setTimeout(() => {
      setUploadProgress(null);
    }, 2000);

    return () => window.clearTimeout(clearProgress);
  }, [id, queryClient, triggerAlert, uploadProgress]);

  const openPopup = (data?: AlbumImageFormData | null) => {
    setIsEditMode(Boolean(data));
    setFormData(data || {});
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setFormData({});
    setIsEditMode(false);
  };

  const saveImage = async () => {
    if (!id) return;
    try {
      const files = (formData.file || []).map(({ file }) => file);
      if (files.length === 0) {
        triggerAlert("Choose at least one image to upload", "warning");
        return;
      }

      const response = await uploadImages(id, files);
      const job = response.data;
      if (!job?.id) {
        throw new Error("Upload was accepted without a job ID");
      }

      setUploadProgress({
        jobId: job.id,
        completed: job.completed || 0,
        total: job.total || files.length,
        status: job.status || "queued",
        error: job.error,
      });
      closePopup();
    } catch (saveError) {
      triggerAlert(
        getApiErrorMessage(saveError, "Failed to upload image"),
        "danger",
      );
    }
  };

  const albumForm = (
    <FormDrawer
      closePopup={closePopup}
      title={isEditMode ? "Edit Image" : "Add Image"}
      onSubmit={saveImage}
    >
      <AlbumImageUploadField
        value={formData.file ?? []}
        onChange={(file) => setFormData((current) => ({ ...current, file }))}
        onInvalidFiles={() =>
          triggerAlert("Only image files can be uploaded", "warning")
        }
      />
    </FormDrawer>
  );

  const imageForm = (
    <FormDrawer
      closePopup={closePopup}
      title={isEditMode ? "Edit Image" : "Add Image"}
      onSubmit={async () => {
        try {
          if (!id || !formData.id || !formData.newId) return;
          await renameImage(id, String(formData.id), String(formData.newId));
          triggerAlert(
            `Successfully changed id to ${formData.newId}`,
            "success",
          );
          closePopup();
        } catch (err) {
          triggerAlert(
            getApiErrorMessage(err, "Failed to rename image"),
            "danger",
          );
        } finally {
          await queryClient.invalidateQueries({
            queryKey: queryKeys.albums.detail(id ?? "missing"),
          });
        }
      }}
    >
      <RenameImageField
        currentId={formData.id}
        value={formData.newId ?? ""}
        onChange={(newId) => setFormData((current) => ({ ...current, newId }))}
      />
    </FormDrawer>
  );

  const confirmDelete = (itemId?: string) => {
    setSelectedItemId(itemId ?? null);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!id || !selectedItemId) return;
    try {
      await deleteImage(id, selectedItemId);
      setDeleteModalOpen(false);
      setSelectedItemId(null);
      await queryClient.invalidateQueries({
        queryKey: queryKeys.albums.detail(id),
      });
    } catch (deleteError) {
      triggerAlert(
        getApiErrorMessage(deleteError, "Failed to delete image"),
        "danger",
      );
    }
  };

  const albumImagesSection = (
    <div className="album-detail-grid">
      {album?.images?.map((image, index) => (
        <div key={image.id} className="col">
          <ImageMenu
            imageUrl={getAlbumImageUrl(image?.url)}
            imageId={image.id}
            alt={image?.id}
            onOpen={() => setSelectedImageIndex(index)}
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
      <PageHeader
        breadcrumbs={[
          { label: "Overview", to: "/" },
          { label: "Albums", to: "/albums" },
          { label: album?.title ?? "Album" },
        ]}
        titleContent={
          <div className="d-flex align-items-center gap-3 flex-wrap">
            <h1>{album?.title ?? "Album"}</h1>
            <AlbumVisibilityBadge type={album?.type} />
          </div>
        }
        description={
          <>
            <span className="d-block">{album?.desc}</span>
            {album?.date ? (
              <small className="d-block mt-2">
                {new Date(album.date).toLocaleDateString()}
              </small>
            ) : null}
          </>
        }
        actions={
          <div className="d-flex gap-2 flex-wrap">
            <Button
              variant="outline-secondary"
              onClick={() => {
                if (!album) return;
                setDetailsForm(
                  normalizeAlbumPreview(
                    album as image_service_model_AlbumPreview,
                  ),
                );
                setShowDetails(true);
              }}
            >
              <Pencil size={17} /> Edit details
            </Button>
            {!albumQuery.error && !showPopup ? (
              <Button onClick={() => openPopup()}>
                <ImagePlus size={17} /> Upload images
              </Button>
            ) : null}
          </div>
        }
      />

      <Container fluid="xl" className="page-content">
        {uploadProgress ? (
          <UploadProgress
            completed={uploadProgress.completed}
            total={uploadProgress.total}
            status={uploadProgress.status}
          />
        ) : null}
        <AsyncState
          isEmpty={(album?.images || []).length === 0}
          loading={albumQuery.isPending}
          error={albumQuery.error ? normalizeApiError(albumQuery.error) : null}
        >
          {albumImagesSection}
        </AsyncState>
      </Container>

      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        title="Delete Image"
        message="Are you sure you want to delete this image?"
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />

      {showPopup ? (isEditMode ? imageForm : albumForm) : null}
      {showDetails ? (
        <FormDrawer
          closePopup={() => setShowDetails(false)}
          title="Edit album"
          onSubmit={async () => {
            await updateAlbum(detailsForm as image_service_model_AlbumPreview);
            await queryClient.invalidateQueries({
              queryKey: queryKeys.albums.detail(id ?? "missing"),
            });
            setShowDetails(false);
          }}
        >
          <AlbumForm value={detailsForm} onChange={setDetailsForm} />
        </FormDrawer>
      ) : null}
      <AlbumLightboxModal
        albumTitle={album?.title}
        images={album?.images ?? []}
        selectedImageIndex={selectedImageIndex}
        onClose={() => setSelectedImageIndex(null)}
        onSelectImage={setSelectedImageIndex}
      />
    </>
  );
};
export default AlbumDetailPage;
