import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useDarkMode } from "@/hooks/theme/useDarkMode";
import { ImagesIcon } from "@/assets/icons";

interface AlbumCardData {
  id?: string | number;
  preview_image?: string;
  title?: string;
  description?: string;
  images_count?: number;
}

interface EditableAlbumCardProps {
  album: AlbumCardData;
  onEdit?: (album: AlbumCardData) => void;
  onDelete?: (album: AlbumCardData) => void;
}

const EditableAlbumCard = ({
  album,
  onEdit,
  onDelete,
}: EditableAlbumCardProps) => {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();

  const handleNavigate = () => {
    navigate(`/albums/${album.id}`);
  };

  return (
    <Card
      className={`h-100 rounded-4 app-interactive-card app-album-card editable-album-card ${
        isDarkMode ? "text-white" : ""
      }`}
      style={{
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        boxShadow: isDarkMode
          ? "0 6px 16px rgba(0, 0, 0, 0.4)"
          : "0 6px 20px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
      onClick={handleNavigate}
    >
      <div style={{ width: "100%", height: "180px", overflow: "hidden" }}>
        {album.preview_image ? (
          <Card.Img
            className="app-card-cover"
            src={album.preview_image}
            alt={album.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            className="d-flex align-items-center justify-content-center"
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: isDarkMode ? "#2c2c2c" : "#eaeaea",
            }}
          >
            <ImagesIcon width={48} height={48} className="text-secondary" />
          </div>
        )}
      </div>

      <Card.Body className="p-3 d-flex flex-column flex-grow-1 app-card-body">
        <Card.Title
          className="fw-semibold mb-1 app-card-title"
          style={{ fontSize: "1.1rem" }}
        >
          {album.title}
        </Card.Title>
        <Card.Text
          className="text-secondary small mb-2"
          style={{ opacity: 0.85, minHeight: "3em" }}
        >
          {album.description ? (
            album.description
          ) : (
            <span className="text-muted">No description</span>
          )}
        </Card.Text>
        <Card.Text className="text-muted small mt-auto">
          📸 {album.images_count} images
        </Card.Text>
        <div className="app-card-actions mt-3">
          {onEdit ? (
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(album);
              }}
              aria-label="Edit album"
            >
              Edit
            </Button>
          ) : null}
          {onDelete ? (
            <Button
              variant="outline-danger"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(album);
              }}
              aria-label="Delete album"
            >
              Delete
            </Button>
          ) : null}
        </div>
      </Card.Body>
    </Card>
  );
};

export default EditableAlbumCard;
