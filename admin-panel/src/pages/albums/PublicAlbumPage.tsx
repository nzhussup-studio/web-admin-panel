import { useState } from "react";
import { useParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
import AlbumLightboxModal from "@/components/albums/AlbumLightboxModal";
import PublicAlbumGallery from "@/components/albums/PublicAlbumGallery";
import Header from "@/components/layout/Header";
import PageState from "@/components/pages/PageState";
import { useAlbum } from "@/hooks/albums/useAlbum";

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
        text={album ? "Album " + album.title : "Album"}
        showClearCacheButton={false}
        allowUnauthenticatedLogin
      />
      <Container className="my-5">
        {album?.desc ? (
          <div
            className="mx-auto mb-4 text-center"
            style={{ maxWidth: "48rem" }}
          >
            <p className="lead text-secondary mb-0">{album.desc}</p>
          </div>
        ) : null}
        <PageState
          isEmpty={images.length === 0}
          loading={loading}
          error={error}
        >
          <PublicAlbumGallery images={images} onOpenImage={openImage} />
        </PageState>
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
