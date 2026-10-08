import { useParams } from "react-router-dom";
import React, { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import ProgressBar from "react-bootstrap/ProgressBar";
import Header from "@/components/layout/Header";
import PageState from "@/components/pages/PageState";
import {
  AlbumService,
  ImageService,
  type image_service_model_Album,
  type image_service_model_Image,
} from "@/lib/api/client";
import { getApiErrorMessage, normalizeApiError } from "@/lib/api/errors";
import Popup from "@/components/shared/Popup";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import FramedImageCard from "@/components/albums/FramedImageCard";
import config from "@/config/app-config";
import { useOptionalGlobalAlert } from "@/hooks/alerts/useOptionalGlobalAlert";
import { FunnelIcon } from "@/assets/icons";
import { queryKeys } from "@/api";

type ImagePreview = { file: Blob; preview: string };
type UploadProgress = {
  jobId: string;
  completed: number;
  total: number;
  status: string;
  error?: string;
};
type AlbumImageFormData = Partial<
  image_service_model_Image & { file?: ImagePreview[]; newId?: string }
>;

const AlbumPage = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { triggerAlert } = useOptionalGlobalAlert();
  const [isAscending, setIsAscending] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(
    null,
  );
  const [formData, setFormData] = useState<AlbumImageFormData>({});

  const albumQuery = useQuery({
    queryKey: queryKeys.albums.detail(id ?? "missing"),
    queryFn: async () =>
      (await AlbumService.getV1Album1(id as string)).data ?? null,
    enabled: Boolean(id),
  });
  const album = useMemo(() => {
    if (!albumQuery.data) return null;
    return {
      ...albumQuery.data,
      images: [...(albumQuery.data.images ?? [])].sort((a, b) =>
        isAscending
          ? String(a.id ?? "").localeCompare(String(b.id ?? ""))
          : String(b.id ?? "").localeCompare(String(a.id ?? "")),
      ),
    } as image_service_model_Album;
  }, [albumQuery.data, isAscending]);

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
        const response = await ImageService.getV1AlbumUpload(
          id,
          uploadProgress.jobId,
        );
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
        const response = await ImageService.postV1AlbumUpload(id, {
          file: files,
        });
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
          await ImageService.patchV1AlbumRename(
            id,
            String(formData.id),
            String(formData.newId),
          );
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
      await ImageService.deleteV1Album(id, selectedItemId);
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

  const toggleSort = () => {
    setIsAscending((prev) => !prev);
  };

  const handleCopyPublicLink = async () => {
    if (!album?.id) return;

    if (!["public", "semi-public"].includes(album.type)) {
      triggerAlert(
        "Public links are only available for public or semi-public albums.",
        "warning",
      );
      return;
    }

    const publicUrl = `${window.location.origin}/public/albums/${album.id}`;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(publicUrl);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = publicUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      triggerAlert("Public album link copied to clipboard!", "success");
    } catch (copyError) {
      triggerAlert(
        getApiErrorMessage(copyError, "Failed to copy public album link"),
        "danger",
      );
    }
  };

  const albumImagesSection = (
    <div className="row row-cols-2 row-cols-sm-2 row-cols-md-3 g-4">
      {album?.images?.map((image) => (
        <div key={image.id} className="col">
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
      <Header
        eyebrow="Albums / Detail"
        text={album?.title ?? "Album"}
        description={album?.desc}
        actions={
          <div className="d-flex gap-2 flex-wrap">
            {album && ["public", "semi-public"].includes(album.type) ? (
              <Button
                variant="outline-secondary"
                onClick={handleCopyPublicLink}
              >
                Copy public link
              </Button>
            ) : null}
            <Button variant="outline-secondary" onClick={toggleSort}>
              <FunnelIcon width={16} height={16} /> Sort
            </Button>
            {!albumQuery.error && !showPopup ? (
              <Button onClick={() => openPopup()}>Upload images</Button>
            ) : null}
          </div>
        }
      />

      <Container fluid="xl" className="page-content">
        {uploadProgress ? (
          <div className="mb-4" role="status" aria-live="polite">
            <div className="d-flex justify-content-between mb-2">
              <span>
                {uploadProgress.status === "failed"
                  ? "Image upload failed"
                  : uploadProgress.status === "completed"
                    ? "Images uploaded"
                    : "Uploading images"}
              </span>
              <span>
                {uploadProgress.completed}/{uploadProgress.total}
              </span>
            </div>
            <ProgressBar
              now={
                uploadProgress.total > 0
                  ? (uploadProgress.completed / uploadProgress.total) * 100
                  : 0
              }
              variant={
                uploadProgress.status === "failed" ? "danger" : "primary"
              }
              label={`${uploadProgress.completed}/${uploadProgress.total}`}
            />
          </div>
        ) : null}
        <PageState
          isEmpty={(album?.images || []).length === 0}
          loading={albumQuery.isPending}
          error={albumQuery.error ? normalizeApiError(albumQuery.error) : null}
        >
          {albumImagesSection}
        </PageState>
      </Container>

      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        title="Delete Image"
        message="Are you sure you want to delete this image?"
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />

      {showPopup ? (isEditMode ? imageForm : albumForm) : null}
    </>
  );
};
export default AlbumPage;
