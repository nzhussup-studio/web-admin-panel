import { useQuery } from "@tanstack/react-query";
import {
  AlbumService,
  getAuthenticatedBlob,
  PublicAlbumService,
  queryKeys,
  type image_service_model_AlbumPreview,
} from "@/api";
import { createRequestPacer } from "./requestPacer";

// Authenticated album images are fetched as blobs because <img> cannot attach
// the bearer token. Pace starts to 10/second so album refreshes stay below the
// gateway's 20/second authenticated limit while status polling is still active.
const scheduleAdminImageRequest = createRequestPacer(100);

const loadAdminImage = async (albumId: string, imageId: string) => {
  const path = `/v1/admin/albums/${encodeURIComponent(albumId)}/images/${encodeURIComponent(imageId)}`;
  const blob = await scheduleAdminImageRequest(() =>
    getAuthenticatedBlob(path),
  );
  return URL.createObjectURL(blob);
};

const loadAdminPreview = async (url?: string) => {
  if (!url) return url;
  const match = url.match(/\/v1\/albums\/([^/]+)\/images\/([^/?#]+)/);
  if (!match) return url;
  return loadAdminImage(
    decodeURIComponent(match[1]),
    decodeURIComponent(match[2]),
  );
};

const withAuthenticatedImages = async <
  T extends {
    id?: string;
    images?: Array<{ id?: string; url?: string }>;
  },
>(
  album: T | null,
): Promise<T | null> => {
  if (!album?.id || !album.images) return album;
  const images = await Promise.all(
    album.images.map(async (image) => ({
      ...image,
      url: image.id
        ? await loadAdminImage(album.id as string, image.id)
        : image.url,
    })),
  );
  return { ...album, images };
};

export const useAlbum = (id?: string) => {
  const query = useQuery({
    queryKey: queryKeys.albums.detail(id ?? "missing"),
    queryFn: async () =>
      withAuthenticatedImages(
        (await AlbumService.getV1AdminAlbums1(id as string)).data ?? null,
      ),
    enabled: Boolean(id),
  });

  return {
    album: query.data ?? null,
    loading: query.isPending,
    error: query.error,
    refetch: query.refetch,
  };
};

export const getPublicAlbum = async (id: string) =>
  (await PublicAlbumService.getV1Albums1(id)).data ?? null;

export const usePublicAlbum = (id?: string) => {
  const query = useQuery({
    queryKey: [...queryKeys.albums.detail(id ?? "missing"), "public"],
    queryFn: () => getPublicAlbum(id as string),
    enabled: Boolean(id),
  });

  return {
    album: query.data ?? null,
    loading: query.isPending,
    error: query.error,
    refetch: query.refetch,
  };
};

export const listAlbums = async () => {
  const albums = (await AlbumService.getV1AdminAlbums("all")).data ?? [];
  return Promise.all(
    albums.map(async (album: image_service_model_AlbumPreview) => ({
      ...album,
      preview_image: await loadAdminPreview(album.preview_image),
    })),
  );
};

export const getAlbum = async (id: string) =>
  withAuthenticatedImages(
    (await AlbumService.getV1AdminAlbums1(id)).data ?? null,
  );
