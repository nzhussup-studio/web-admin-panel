import Button from "@/components/ui/button";
import Image from "react-bootstrap/Image";
import Ratio from "react-bootstrap/Ratio";
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
        <div key={image.id}>
          <Button
            type="button"
            variant="link"
            className="album-public-image"
            onClick={() => onOpenImage(index)}
            aria-label={`Open image ${image.id || index + 1}`}
          >
            <div className="album-public-image-frame">
              <Ratio aspectRatio="1x1">
                <Image
                  src={getAlbumImageUrl(image.url)}
                  alt={image.id || `Album image ${index + 1}`}
                  className="w-100 h-100 object-fit-cover"
                />
              </Ratio>
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
