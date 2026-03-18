import { X } from "lucide-react";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import { useDarkMode } from "@/hooks/theme/useDarkMode";
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
  const { isDarkMode } = useDarkMode();
  const { triggerAlert } = useGlobalAlert();

  const handleCopyUrl = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(imageUrl);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = imageUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      triggerAlert("Image URL copied to clipboard!", "success");
    } catch (err) {
      console.error("Copy failed:", err);
      triggerAlert("Failed to copy image URL.", "danger");
    }
  };

  const imageId = imageUrl?.split("/").pop();

  return (
    <>
      <div
        data-testid='image-frame'
        className={`position-relative rounded-3 overflow-hidden image-frame app-image-frame ${
          isDarkMode ? "dark-mode" : ""
        }`}
        onClick={handleCopyUrl}
        style={{
          cursor: "pointer",
          border: isDarkMode ? "1px solid #444" : "1px solid #ddd",
          backgroundColor: isDarkMode ? "#1f1f1f" : "#fff",
          width: "100%",
          paddingTop: "100%", // maintain 1:1 aspect ratio
          transition: "box-shadow 0.3s ease, transform 0.3s ease",
        }}
      >
        <div
          className='position-absolute top-0 start-0 w-100 h-100'
          style={{ overflow: "hidden", borderRadius: "12px" }}
        >
          <img
            src={imageUrl}
            alt={alt || "Framed image"}
            className='w-100 h-100 object-fit-cover image-frame-img app-image-frame-img'
            loading='lazy'
            style={{
              transition: "transform 0.3s ease, filter 0.3s ease",
            }}
          />

          {/* Delete Button - Top Right */}
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
            aria-label='Delete image'
            variant='danger'
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              zIndex: 10,
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              padding: 0,
            }}
          >
            <X size={18} />
          </Button>

          {/* Edit Button - Top Left */}
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
            aria-label='Edit image'
            variant='success'
            size='sm'
            style={{
              position: "absolute",
              top: "8px",
              left: "8px",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              zIndex: 10,
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              padding: 0,
            }}
          >
            Edit
          </Button>

          {imageId && (
            <Badge
              bg='dark'
              style={{
                position: "absolute",
                bottom: "8px",
                left: "50%",
                transform: "translateX(-50%)",
                borderRadius: "12px",
                fontSize: "12px",
                zIndex: 5,
                opacity: 0.85,
              }}
            >
              {imageId}
            </Badge>
          )}
        </div>
      </div>
    </>
  );
};

export default FramedImageCard;
