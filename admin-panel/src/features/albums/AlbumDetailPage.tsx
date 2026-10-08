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
import { AlbumForm, ImageMenu, UploadProgress } from "./components";
import { useOptionalGlobalAlert } from "@/providers/alerts";
import Badge from "react-bootstrap/Badge";
import { API_BASE, queryKeys } from "@/api";
import {
  deleteImage,
  getAlbum,
  getUploadStatus,
  renameImage,
  updateAlbum,
  uploadImages,
} from "./api";
import { normalizeAlbumPreview, type AlbumPreviewView } from "./albumData";

type ImagePreview = { file: Blob; preview: string };
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

  const handleFileInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const readFiles = files.map((file) => {
      return new Promise<ImagePreview>((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          resolve({ file, preview: String(reader.result || "") });
        };
      });
    });

    const results = await Promise.all(readFiles);
    const updatedPreviews = [...(formData.file || []), ...results];
    setFormData({ ...formData, file: updatedPreviews });
  };

  const removeImagePreview = (index: number) => {
    const updatedPreviews = (formData.file || []).filter((_, i) => i !== index);
    setFormData({ ...formData, file: updatedPreviews });
  };

  const saveImage = async () => {
    if (!id) return;
    try {
      const files = (formData.file || []).map(({ file }) => file);
      if (files.length > 0) {
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
        return;
      }
      await queryClient.invalidateQueries({
        queryKey: queryKeys.albums.detail(id),
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
        <Form.Label>Upload Images</Form.Label>
        <Form.Control
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileInputChange}
          required
          aria-label="Choose files"
        />
      </Form.Group>

      {(formData.file || []).length > 0 ? (
        <div className="d-flex flex-wrap gap-2 mt-3">
          {(formData.file || []).map((image, index) => (
            <div
              key={index}
              style={{
                position: "relative",
                width: "80px",
                height: "80px",
              }}
            >
              <img
                src={image.preview}
                alt={`Preview ${index}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
              <Button
                type="button"
                onClick={() => removeImagePreview(index)}
                aria-label="Remove image"
                variant="danger"
                size="sm"
                style={{
                  position: "absolute",
                  top: "-6px",
                  right: "-6px",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  fontSize: "12px",
                  padding: 0,
                }}
              >
                ×
              </Button>
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
      {formData.id}
      <Form.Group className="mt-3">
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
    <div className="row row-cols-2 row-cols-md-3 row-cols-xl-4 g-4">
      {album?.images?.map((image) => (
        <div key={image.id} className="col">
          <ImageMenu
            imageUrl={`${API_BASE}${image?.url || ""}`}
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
              Edit details
            </Button>
            {!albumQuery.error && !showPopup ? (
              <Button onClick={() => openPopup()}>Upload images</Button>
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
        <h2 className="h4 fw-bold mb-3">{album?.images?.length ?? 0} images</h2>
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
    </>
  );
};
export default AlbumDetailPage;
