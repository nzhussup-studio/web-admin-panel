import { API_BASE, type image_service_model_AlbumPreview } from "@/api";

export type AlbumPreviewView = image_service_model_AlbumPreview & {
  description?: string;
  images_count?: number;
};

export const normalizeAlbumPreview = (
  album: image_service_model_AlbumPreview,
): AlbumPreviewView => ({
  ...album,
  description: album.desc,
  images_count: album.image_count,
});

export const getAlbumImageUrl = (imageUrl?: string) =>
  `${API_BASE}${imageUrl || ""}`;
