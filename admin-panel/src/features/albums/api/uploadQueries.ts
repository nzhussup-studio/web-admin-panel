import { ImageService } from "@/api";

export const getUploadStatus = (albumId: string, uploadId: string) =>
  ImageService.getV1AdminAlbumsUploads(albumId, uploadId);
export const uploadImages = (albumId: string, files: Blob[]) =>
  ImageService.postV1AdminAlbumsImages(albumId, { file: files });
