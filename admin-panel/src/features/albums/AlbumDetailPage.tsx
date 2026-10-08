import { useParams } from "react-router-dom";
import React, { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Button from "@/components/ui/button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { PageHeader as Header } from "@/components/layout/page-header";
import { AsyncState } from "@/components/feedback/error-state";
import {
  type image_service_model_Album,
  type image_service_model_AlbumPreview,
  type image_service_model_Image,
} from "@/api";
import { getApiErrorMessage, normalizeApiError } from "@/api";
import { FormDrawer as Popup } from "@/components/ui/form-drawer";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  AlbumForm,
  AlbumLightboxModal,
  ImageMenu,
  UploadProgress,
} from "./components";
import { useOptionalGlobalAlert } from "@/providers/alerts";
import Badge from "react-bootstrap/Badge";
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
import { ImagePlus, Pencil, X } from "lucide-react";

type ImagePreview = { file: File; preview: string };
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
    if (!uploadProgress || uploadProgress.status === "processing") return;
    if (uploadProgress.status === "completed") {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.albums.detail(id ?? "missing"),
      });
    } else if (uploadProgress.status === "failed") {
      triggerAlert(
        uploadProgress.error || "Upload processing failed",
        "danger",
      );
    }
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

  const addFilePreviews = async (files: File[]) => {
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    if (imageFiles.length !== files.length) {
      triggerAlert("Only image files can be uploaded", "warning");
    }
    if (imageFiles.length === 0) return;

    const readFiles = imageFiles.map((file) => {
      return new Promise<ImagePreview>((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          resolve({ file, preview: String(reader.result || "") });
        };
      });
    });

    const results = await Promise.all(readFiles);
    setFormData((current) => ({
      ...current,
      file: [...(current.file || []), ...results],
    }));
  };

  const handleFileInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    await addFilePreviews(Array.from(e.target.files || []));
    e.target.value = "";
  };

  const removeImagePreview = (index: number) => {
    const updatedPreviews = (formData.file || []).filter((_, i) => i !== index);
    setFormData({ ...formData, file: updatedPreviews });
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
    <Popup
      closePopup={closePopup}
      title={isEditMode ? "Edit Image" : "Add Image"}
      onSubmit={saveImage}
    >
      <Form.Group className="mb-4">
        <Form.Label>Images</Form.Label>
        <label
          className="album-upload-dropzone"
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            void addFilePreviews(Array.from(event.dataTransfer.files));
          }}
        >
          <Form.Control
            className="visually-hidden"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileInputChange}
            aria-label="Choose images"
          />
          <span className="album-upload-icon">
            <ImagePlus size={24} />
          </span>
          <strong>Drop images here or choose files</strong>
          <small>JPEG, PNG and HEIC files are supported</small>
        </label>
      </Form.Group>

      {(formData.file || []).length > 0 ? (
        <div className="album-upload-previews mt-3">
          {(formData.file || []).map((image, index) => (
            <div
              key={`${image.file.name}-${index}`}
              className="album-upload-preview"
            >
              <img src={image.preview} alt={`Preview of ${image.file.name}`} />
              <Button
                type="button"
                onClick={() => removeImagePreview(index)}
                aria-label="Remove image"
                variant="light"
                size="sm"
                className="album-upload-remove"
              >
                <X size={14} />
              </Button>
              <span className="text-truncate">{image.file.name}</span>
            </div>
          ))}
        </div>
      ) : null}
    </Popup>
  );

  const imageForm = (
    <Popup
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
      <div className="album-rename-current">
        <span>Current image ID</span>
        <strong>{formData.id}</strong>
      </div>
      <Form.Group className="mt-4">
        <Form.Label>New Image ID</Form.Label>
        <InputGroup>
          <Form.Control
            value={formData.newId ?? ""}
            onChange={(e) =>
              setFormData({ ...formData, newId: e.target.value })
            }
            required
          />
          <Button
            variant="outline-secondary"
            onClick={() => setFormData({ ...formData, newId: "" })}
            disabled={!formData.newId}
          >
            Clear
          </Button>
        </InputGroup>
      </Form.Group>
    </Popup>
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
      <Header
        breadcrumbs={[
          { label: "Overview", to: "/" },
          { label: "Albums", to: "/albums" },
          { label: album?.title ?? "Album" },
        ]}
        titleContent={
          <div className="d-flex align-items-center gap-3 flex-wrap">
            <h1>{album?.title ?? "Album"}</h1>
            {album?.type ? (
              <Badge
                bg={`${album.type === "private" ? "danger" : album.type === "semi-public" ? "warning" : "success"}-subtle`}
                text={
                  album.type === "private"
                    ? "danger"
                    : album.type === "semi-public"
                      ? "warning"
                      : "success"
                }
                className="text-capitalize"
              >
                {album.type}
              </Badge>
            ) : null}
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
        <Popup
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
        </Popup>
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
