import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Ratio from "react-bootstrap/Ratio";
import type { image_service_model_Image } from "@/lib/api/client";
import { getAlbumImageUrl } from "@/lib/albums";

interface PublicAlbumGalleryProps {
  images: image_service_model_Image[];
  onOpenImage: (index: number) => void;
}

const PublicAlbumGallery = ({
  images,
  onOpenImage,
}: PublicAlbumGalleryProps) => {
  return (
    <div className="row row-cols-2 row-cols-md-3 row-cols-xl-4 g-3 g-md-4">
      {images.map((image, index) => (
        <div key={image.id} className="col">
          <Button
            type="button"
            variant="link"
            className="w-100 border-0 p-0 bg-transparent text-start text-decoration-none"
            onClick={() => onOpenImage(index)}
            aria-label={`Open image ${image.id || index + 1}`}
          >
            <div
              className="position-relative overflow-hidden rounded-4 shadow-sm"
              style={{
                background:
                  "linear-gradient(145deg, rgba(255,255,255,0.9), rgba(230,236,244,0.92))",
              }}
            >
              <Ratio aspectRatio="1x1">
                <Image
                  src={getAlbumImageUrl(image.url)}
                  alt={image.id || `Album image ${index + 1}`}
                  className="w-100 h-100 object-fit-cover"
                />
              </Ratio>
            </div>
          </Button>
        </div>
      ))}
    </div>
  );
};

export default PublicAlbumGallery;
