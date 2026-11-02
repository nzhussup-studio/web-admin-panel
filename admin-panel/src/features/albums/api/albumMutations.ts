import {
  AlbumService,
  ImageService,
  type image_service_model_AlbumPreview,
} from "@/api";

export const createAlbum = (album: image_service_model_AlbumPreview) =>
  AlbumService.postV1AdminAlbums(album);
export const updateAlbum = (album: image_service_model_AlbumPreview) =>
  AlbumService.putV1AdminAlbums(String(album.id), album);
export const deleteAlbum = (id: string) => AlbumService.deleteV1AdminAlbums(id);
export const renameImage = (
  albumId: string,
  imageId: string,
  fileName: string,
) => ImageService.patchV1AdminAlbumsImages(albumId, imageId, fileName);
export const deleteImage = (albumId: string, imageId: string) =>
  ImageService.deleteV1AdminAlbumsImages(albumId, imageId);
