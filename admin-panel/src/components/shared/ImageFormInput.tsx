import type { ChangeEvent } from "react";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

interface PreviewImage {
  file: Blob;
  preview: string;
}

interface ImageFormInputProps {
  label?: string;
  value?: PreviewImage[];
  onChange: (images: PreviewImage[]) => void;
  required?: boolean;
  multiple?: boolean;
}

const ImageFormInput = ({
  label,
  value,
  onChange,
  required = false,
  multiple = true,
}: ImageFormInputProps) => {
  const [previewImages, setPreviewImages] = useState<PreviewImage[]>(
    value || []
  );

  const handleFileInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const readFiles = files.map((file) => {
      return new Promise<PreviewImage>((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          resolve({ file, preview: String(reader.result || "") });
        };
      });
    });

    const results = await Promise.all(readFiles);
    const updatedPreviews = [...previewImages, ...results];
    setPreviewImages(updatedPreviews);
    onChange(updatedPreviews);
  };

  const removeImagePreview = (index: number) => {
    const updatedPreviews = previewImages.filter((_, i) => i !== index);
    setPreviewImages(updatedPreviews);
    onChange(updatedPreviews);
  };

  return (
    <div className='mb-4'>
      {label && <Form.Label>{label}</Form.Label>}

      <input
        type='file'
        id='image-upload-input'
        style={{ display: "none" }}
        accept='image/*'
        multiple={multiple}
        onChange={handleFileInputChange}
        required={required}
        aria-label='Choose files'
      />
      <Button as='label' htmlFor='image-upload-input' size='sm'>
        Select Image{multiple && "s"}
      </Button>

      {previewImages.length > 0 && (
        <div className='d-flex flex-wrap gap-2 mt-3'>
          {previewImages.map((image, index) => (
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
                type='button'
                onClick={() => removeImagePreview(index)}
                aria-label='Remove image'
                variant='danger'
                size='sm'
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
      )}
    </div>
  );
};

export default ImageFormInput;
