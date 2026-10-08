import { ImageService } from "@/api";

export const getUploadStatus = (albumId: string, uploadId: string) =>
  ImageService.getV1AlbumUpload(albumId, uploadId);
export const uploadImages = (albumId: string, files: Blob[]) =>
  ImageService.postV1AlbumUpload(albumId, { file: files });
