import Button from "@/components/ui/button";
import Image from "react-bootstrap/Image";
import type { image_service_model_Image } from "@/api";
import { getAlbumImageUrl } from "../albumData";
import { Eye } from "lucide-react";

interface ImageGridProps {
  images: image_service_model_Image[];
  onOpenImage: (index: number) => void;
}

const ImageGrid = ({ images, onOpenImage }: ImageGridProps) => {
  return (
    <div className="album-public-grid">
      {images.map((image, index) => (
        <div className="album-collage-item" key={image.id}>
          <Button
            type="button"
            variant="link"
            className="album-public-image"
            onClick={() => onOpenImage(index)}
            aria-label={`Open image ${image.id || index + 1}`}
          >
            <div className="album-public-image-frame">
              <Image
                src={getAlbumImageUrl(image.url)}
                alt={image.id || `Album image ${index + 1}`}
                loading={index < 3 ? "eager" : "lazy"}
              />
              <span className="album-public-image-overlay" aria-hidden="true">
                <Eye size={20} /> View image
              </span>
            </div>
          </Button>
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;
