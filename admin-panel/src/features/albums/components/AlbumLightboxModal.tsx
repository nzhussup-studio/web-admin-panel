import { useEffect } from "react";
import Carousel from "react-bootstrap/Carousel";
import Image from "react-bootstrap/Image";
import Modal from "react-bootstrap/Modal";
import type { image_service_model_Image } from "@/api";
import { getAlbumImageUrl } from "../albumData";

interface AlbumLightboxModalProps {
  albumTitle?: string;
  images: image_service_model_Image[];
  selectedImageIndex: number | null;
  onClose: () => void;
  onSelectImage: (index: number) => void;
}

const AlbumLightboxModal = ({
  albumTitle,
  images,
  selectedImageIndex,
  onClose,
  onSelectImage,
}: AlbumLightboxModalProps) => {
  useEffect(() => {
    if (selectedImageIndex === null || images.length <= 1) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        onSelectImage((selectedImageIndex - 1 + images.length) % images.length);
      }

      if (event.key === "ArrowRight") {
        onSelectImage((selectedImageIndex + 1) % images.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [images.length, onSelectImage, selectedImageIndex]);

  return (
    <Modal
      show={selectedImageIndex !== null}
      onHide={onClose}
      centered
      size="xl"
      contentClassName="app-modal-content album-lightbox-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {selectedImageIndex !== null
            ? images[selectedImageIndex]?.id || albumTitle || "Album image"
            : albumTitle || "Album image"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedImageIndex !== null ? (
          <Carousel
            activeIndex={selectedImageIndex}
            onSelect={(index) => onSelectImage(index)}
            interval={null}
            indicators={images.length > 1}
            controls={images.length > 1}
          >
            {images.map((image, index) => (
              <Carousel.Item key={image.id || index}>
                <div className="album-lightbox-frame">
                  <Image
                    src={getAlbumImageUrl(image.url)}
                    alt={image.id || `Album image ${index + 1}`}
                    className="album-lightbox-image"
                  />
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        ) : null}
      </Modal.Body>
      {selectedImageIndex !== null ? (
        <Modal.Footer className="justify-content-center text-secondary small">
          {selectedImageIndex + 1} of {images.length}
        </Modal.Footer>
      ) : null}
    </Modal>
  );
};

export default AlbumLightboxModal;
