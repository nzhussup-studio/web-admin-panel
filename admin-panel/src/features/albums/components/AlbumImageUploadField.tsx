import type { ChangeEvent } from "react";
import Button from "@/components/ui/button";
import Form from "react-bootstrap/Form";
import { ImagePlus, X } from "lucide-react";
import { createImagePreview, isHeic, type ImagePreview } from "./imagePreview";

export type { ImagePreview } from "./imagePreview";

interface AlbumImageUploadFieldProps {
  value: ImagePreview[];
  onChange: (images: ImagePreview[]) => void;
  onInvalidFiles: () => void;
  onPreviewError: () => void;
}

export function AlbumImageUploadField({
  value,
  onChange,
  onInvalidFiles,
  onPreviewError,
}: AlbumImageUploadFieldProps) {
  const addFiles = async (files: File[]) => {
    const imageFiles = files.filter(
      (file) => file.type.startsWith("image/") || isHeic(file),
    );
    if (imageFiles.length !== files.length) onInvalidFiles();
    if (imageFiles.length === 0) return;
    const results = await Promise.allSettled(
      imageFiles.map(createImagePreview),
    );
    const previews = results.flatMap((result) =>
      result.status === "fulfilled" ? [result.value] : [],
    );
    if (previews.length !== results.length) onPreviewError();
    if (previews.length > 0) onChange([...value, ...previews]);
  };

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    void addFiles(Array.from(event.target.files || []));
    event.target.value = "";
  };

  return (
    <>
      <Form.Group className="mb-4">
        <Form.Label>Images</Form.Label>
        <label
          className="album-upload-dropzone"
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            void addFiles(Array.from(event.dataTransfer.files));
          }}
        >
          <Form.Control
            className="visually-hidden"
            type="file"
            accept="image/*,.heic,.heif"
            multiple
            onChange={handleInput}
            aria-label="Choose images"
          />
          <span className="album-upload-icon">
            <ImagePlus size={24} />
          </span>
          <strong>Drop images here or choose files</strong>
          <small>JPEG, PNG and HEIC files are supported</small>
        </label>
      </Form.Group>

      {value.length > 0 ? (
        <div className="album-upload-previews mt-3">
          {value.map((image, index) => (
            <div
              key={`${image.file.name}-${index}`}
              className="album-upload-preview"
            >
              <img src={image.preview} alt={`Preview of ${image.file.name}`} />
              <Button
                type="button"
                onClick={() =>
                  onChange(value.filter((_, item) => item !== index))
                }
                aria-label={`Remove ${image.file.name}`}
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
    </>
  );
}
