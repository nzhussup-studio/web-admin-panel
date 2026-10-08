import { useNavigate } from "react-router-dom";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Dropdown from "react-bootstrap/Dropdown";
import { Ellipsis, Images } from "lucide-react";

interface AlbumCardData {
  id?: string | number;
  preview_image?: string;
  title?: string;
  description?: string;
  images_count?: number;
  date?: string;
  type?: string;
}

interface EditableAlbumCardProps {
  album: AlbumCardData;
  onEdit?: (album: AlbumCardData) => void;
  onDelete?: (album: AlbumCardData) => void;
}

const visibilityVariant = (type?: string) =>
  type === "private"
    ? "danger"
    : type === "semi-public"
      ? "warning"
      : "success";

const EditableAlbumCard = ({
  album,
  onEdit,
  onDelete,
}: EditableAlbumCardProps) => {
  const navigate = useNavigate();
  return (
    <Card
      className="h-100 album-card"
      onClick={() => navigate(`/albums/${album.id}`)}
    >
      <div className="album-card-cover">
        {album.preview_image ? (
          <Card.Img
            src={album.preview_image}
            alt={album.title ?? "Album cover"}
          />
        ) : (
          <div className="album-card-placeholder">
            <Images size={36} />
          </div>
        )}
      </div>
      <Card.Body>
        <div className="d-flex align-items-start justify-content-between gap-3">
          <div className="min-w-0">
            <Card.Title>{album.title}</Card.Title>
            <div className="text-secondary small">
              {album.date
                ? new Date(album.date).toLocaleDateString()
                : "No date"}
              <span className="mx-2">·</span>
              {album.images_count ?? 0} images
            </div>
          </div>
          <Dropdown onClick={(event) => event.stopPropagation()}>
            <Dropdown.Toggle
              as={Button}
              variant="outline-secondary"
              size="sm"
              aria-label="Album actions"
            >
              <Ellipsis size={18} />
            </Dropdown.Toggle>
            <Dropdown.Menu align="end">
              {onEdit ? (
                <Dropdown.Item onClick={() => onEdit(album)}>
                  Edit
                </Dropdown.Item>
              ) : null}
              {onDelete ? (
                <Dropdown.Item
                  className="text-danger"
                  onClick={() => onDelete(album)}
                >
                  Delete
                </Dropdown.Item>
              ) : null}
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <Badge
          bg={`${visibilityVariant(album.type)}-subtle`}
          text={visibilityVariant(album.type)}
          className="mt-3 text-capitalize"
        >
          {album.type ?? "unknown"}
        </Badge>
      </Card.Body>
    </Card>
  );
};

export default EditableAlbumCard;
