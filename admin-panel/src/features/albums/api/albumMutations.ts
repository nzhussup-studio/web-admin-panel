import {
  AlbumService,
  ImageService,
  type image_service_model_AlbumPreview,
} from "@/api";

export const createAlbum = (album: image_service_model_AlbumPreview) =>
  AlbumService.postV1Album(album);
export const updateAlbum = (album: image_service_model_AlbumPreview) =>
  AlbumService.putV1Album(String(album.id), album);
export const deleteAlbum = (id: string) => AlbumService.deleteV1Album(id);
export const renameImage = (
  albumId: string,
  imageId: string,
  fileName: string,
) => ImageService.patchV1AlbumRename(albumId, imageId, fileName);
export const deleteImage = (albumId: string, imageId: string) =>
  ImageService.deleteV1Album(albumId, imageId);
