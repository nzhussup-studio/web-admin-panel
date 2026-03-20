import { useNavigate, useParams } from "react-router-dom";
import React, {
  useCallback,
  useEffect,
  useState,
  type ChangeEvent,
} from "react";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Stack from "react-bootstrap/Stack";
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
import { BackCircleIcon, FunnelIcon } from "@/assets/icons";

type ImagePreview = { file: Blob; preview: string };
type AlbumImageFormData = Partial<
  image_service_model_Image & { file?: ImagePreview[]; newId?: string }
>;

const AlbumPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { triggerAlert } = useOptionalGlobalAlert();
  const [album, setAlbum] = useState<image_service_model_Album | null>(null);
  const [isAscending, setIsAscending] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [showLoading, setShowLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<AlbumImageFormData>({});

  const fetchItem = useCallback(async () => {
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
            : String(b.id || "").localeCompare(String(a.id || "")),
        );
      }
      setAlbum(fetchedAlbum);
    } catch (fetchError) {
      const normalizedError = normalizeApiError(fetchError);
      setError(normalizedError);
      triggerAlert(
        getApiErrorMessage(fetchError, "Failed to load album"),
        "danger",
      );
    } finally {
      setShowLoading(false);
    }
  }, [id, isAscending, triggerAlert]);

  useEffect(() => {
    fetchItem();
  }, [fetchItem]);

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
      for (const file of formData.file || []) {
        await ImageService.postV1AlbumUpload(id, { file: file.file });
      }
      await fetchItem();
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
          await fetchItem();
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
      await fetchItem();
    } catch (deleteError) {
      const normalizedError = normalizeApiError(deleteError);
      setError(normalizedError);
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
      <Header text={album ? "Album " + album.title : "Album"} />

      <Container className="my-5">
        <Stack
          direction="horizontal"
          gap={3}
          className="align-items-center justify-content-between flex-wrap mb-4"
        >
          <Button
            variant="outline-secondary"
            className="d-inline-flex align-items-center gap-2"
            onClick={() => navigate(-1)}
          >
            <BackCircleIcon width={16} height={16} />
            Back
          </Button>
          <ButtonGroup className="ms-auto">
            {album && ["public", "semi-public"].includes(album.type) ? (
              <Button variant="outline-success" onClick={handleCopyPublicLink}>
                Copy Public Link
              </Button>
            ) : null}
            <Button
              variant="outline-primary"
              className="d-inline-flex align-items-center gap-2"
              onClick={toggleSort}
            >
              <FunnelIcon width={16} height={16} />
              Sort
            </Button>
            {!error && !showPopup ? (
              <Button variant="primary" onClick={() => openPopup()}>
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
