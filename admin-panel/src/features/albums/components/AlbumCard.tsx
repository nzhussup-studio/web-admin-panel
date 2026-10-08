import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/button";
import Card from "react-bootstrap/Card";
import Dropdown from "react-bootstrap/Dropdown";
import { Copy, Ellipsis, Images } from "lucide-react";
import { getAlbumImageUrl } from "../albumData";
import { AlbumVisibilityBadge } from "./AlbumVisibilityBadge";
import { useOptionalGlobalAlert } from "@/providers/alerts";

interface AlbumCardData {
  id?: string | number;
  preview_image?: string;
  title?: string;
  description?: string;
  images_count?: number;
  date?: string;
  type?: string;
}

interface AlbumCardProps {
  album: AlbumCardData;
  onEdit?: (album: AlbumCardData) => void;
  onDelete?: (album: AlbumCardData) => void;
}

const AlbumCard = ({ album, onEdit, onDelete }: AlbumCardProps) => {
  const navigate = useNavigate();
  const { triggerAlert } = useOptionalGlobalAlert();
  const isShareable = album.type === "public" || album.type === "semi-public";

  const copyPublicUrl = async () => {
    if (!album.id) return;

    try {
      const publicUrl = new URL(`/albums/${album.id}`, window.location.origin);
      await navigator.clipboard.writeText(publicUrl.toString());
      triggerAlert("Public album URL copied", "success");
    } catch {
      triggerAlert("Failed to copy public album URL", "danger");
    }
  };

  return (
    <Card
      className="h-100 album-card"
      onClick={() => navigate(`/albums/${album.id}/manage`)}
    >
      <div className="album-card-cover">
        {album.preview_image ? (
          <Card.Img
            src={getAlbumImageUrl(album.preview_image)}
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
        <div className="album-card-footer mt-3">
          <AlbumVisibilityBadge type={album.type} />
          {isShareable ? (
            <Button
              type="button"
              variant="outline-secondary"
              size="sm"
              onClick={(event) => {
                event.stopPropagation();
                void copyPublicUrl();
              }}
            >
              <Copy size={15} /> Copy public URL
            </Button>
          ) : null}
        </div>
      </Card.Body>
    </Card>
  );
};

export default AlbumCard;
