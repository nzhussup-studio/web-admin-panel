import { useState } from "react";
import { useParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
import { AlbumLightboxModal, ImageGrid } from "./components";
import { PageHeader as Header } from "@/components/layout/page-header";
import { AsyncState } from "@/components/feedback/error-state";
import { useAlbum } from "./api";

const PublicAlbumPage = () => {
  const { id } = useParams();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  );
  const { album, loading, error } = useAlbum(id);
  const images = album?.images || [];

  const openImage = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeImage = () => {
    setSelectedImageIndex(null);
  };

  return (
    <>
      <Header
        text={album?.title ?? "Album"}
        description={album?.desc}
        breadcrumbs={[
          { label: "Overview", to: "/" },
          { label: "Albums", to: "/albums" },
          { label: album?.title ?? "Album" },
        ]}
      />
      <Container fluid="xl" className="page-content public-album-page">
        <AsyncState
          isEmpty={images.length === 0}
          loading={loading}
          error={error}
        >
          <ImageGrid images={images} onOpenImage={openImage} />
        </AsyncState>
      </Container>
      <AlbumLightboxModal
        albumTitle={album?.title}
        images={images}
        selectedImageIndex={selectedImageIndex}
        onClose={closeImage}
        onSelectImage={setSelectedImageIndex}
      />
    </>
  );
};

export default PublicAlbumPage;
