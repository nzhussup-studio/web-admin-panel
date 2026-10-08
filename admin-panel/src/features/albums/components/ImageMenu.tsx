import Button from "@/components/ui/button";
import Dropdown from "react-bootstrap/Dropdown";
import { Copy, Ellipsis, Eye, Pencil, Trash2 } from "lucide-react";
import { useGlobalAlert } from "@/providers/alerts";

interface ImageMenuProps {
  imageUrl: string;
  imageId?: string;
  alt?: string;
  onOpen?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
}

const ImageMenu = ({
  imageUrl,
  imageId: providedImageId,
  alt,
  onOpen,
  onDelete,
  onEdit,
}: ImageMenuProps) => {
  const { triggerAlert } = useGlobalAlert();
  const imageId = providedImageId || imageUrl.split("/").pop() || "Image";

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(imageUrl);
      triggerAlert("Image URL copied", "success");
    } catch {
      triggerAlert("Failed to copy image URL", "danger");
    }
  };

  return (
    <figure className="image-tile" data-testid="image-frame">
      <Button
        variant="link"
        className="image-tile-preview"
        onClick={onOpen}
        aria-label={`Preview ${alt ?? imageId}`}
      >
        <img src={imageUrl} alt={alt ?? imageId} loading="lazy" />
        <span className="image-tile-overlay" aria-hidden="true">
          <Eye size={20} /> Preview
        </span>
      </Button>
      <figcaption>
        <div className="image-tile-meta">
          <strong className="text-truncate" title={imageId}>
            {imageId}
          </strong>
          <span>Image</span>
        </div>
        <Dropdown align="end">
          <Dropdown.Toggle
            as={Button}
            variant="outline-secondary"
            size="sm"
            aria-label={`Actions for ${imageId}`}
          >
            <Ellipsis size={17} />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => void copyUrl()}>
              <Copy size={16} /> Copy URL
            </Dropdown.Item>
            {onEdit ? (
              <Dropdown.Item onClick={onEdit}>
                <Pencil size={16} /> Rename
              </Dropdown.Item>
            ) : null}
            {onDelete ? (
              <Dropdown.Item className="text-danger" onClick={onDelete}>
                <Trash2 size={16} /> Delete
              </Dropdown.Item>
            ) : null}
          </Dropdown.Menu>
        </Dropdown>
      </figcaption>
    </figure>
  );
};

export default ImageMenu;
