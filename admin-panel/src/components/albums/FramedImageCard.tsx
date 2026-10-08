import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import { Ellipsis } from "lucide-react";
import { useGlobalAlert } from "@/hooks/alerts/useGlobalAlert";

interface FramedImageCardProps {
  imageUrl: string;
  alt?: string;
  onDelete?: () => void;
  onEdit?: () => void;
}

const FramedImageCard = ({
  imageUrl,
  alt,
  onDelete,
  onEdit,
}: FramedImageCardProps) => {
  const { triggerAlert } = useGlobalAlert();
  const imageId = imageUrl.split("/").pop() ?? "Image";

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
      <button
        type="button"
        className="image-tile-preview"
        onClick={() => void copyUrl()}
        aria-label={`Copy URL for ${alt ?? imageId}`}
      >
        <img src={imageUrl} alt={alt ?? imageId} loading="lazy" />
      </button>
      <figcaption>
        <span className="text-truncate" title={imageId}>
          {imageId}
        </span>
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
              Copy URL
            </Dropdown.Item>
            {onEdit ? (
              <Dropdown.Item onClick={onEdit}>Rename</Dropdown.Item>
            ) : null}
            {onDelete ? (
              <Dropdown.Item className="text-danger" onClick={onDelete}>
                Delete
              </Dropdown.Item>
            ) : null}
          </Dropdown.Menu>
        </Dropdown>
      </figcaption>
    </figure>
  );
};

export default FramedImageCard;
