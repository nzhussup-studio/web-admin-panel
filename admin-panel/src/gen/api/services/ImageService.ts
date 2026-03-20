/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { image_service_model_Image } from "../models/image_service_model_Image";
import type { image_service_model_SuccessResponse } from "../models/image_service_model_SuccessResponse";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class ImageService {
  /**
   * Delete an image from an album
   * Deletes an image by ID from the given album
   * @param id Album ID
   * @param imageId Image ID
   * @returns any Image deleted successfully
   * @throws ApiError
   */
  public static deleteV1Album(
    id: string,
    imageId: string,
  ): CancelablePromise<
    image_service_model_SuccessResponse & {
      data?: Record<string, any>;
    }
  > {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/v1/album/{id}/{imageID}",
      path: {
        id: id,
        imageID: imageId,
      },
      errors: {
        400: `Bad Request`,
        404: `Image Not Found`,
        500: `Internal Server Error`,
      },
    });
  }
  /**
   * Serve an image file
   * Returns the raw image file for preview or download
   * @param id Album ID
   * @param imageId Image ID
   * @returns binary Image file
   * @throws ApiError
   */
  public static getV1Album(
    id: string,
    imageId: string,
  ): CancelablePromise<Blob> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v1/album/{id}/{imageID}",
      path: {
        id: id,
        imageID: imageId,
      },
      errors: {
        400: `Bad Request`,
      },
    });
  }
  /**
   * Rename an image in an album
   * Renames a specific image in an album to a new valid name (alphanumeric, no path components)
   * @param id Album ID
   * @param imageId Image ID
   * @param newName New name for the image (without extension)
   * @returns any Image renamed successfully
   * @throws ApiError
   */
  public static patchV1AlbumRename(
    id: string,
    imageId: string,
    newName: string,
  ): CancelablePromise<
    image_service_model_SuccessResponse & {
      data?: image_service_model_Image;
    }
  > {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/v1/album/{id}/{imageID}/rename",
      path: {
        id: id,
        imageID: imageId,
      },
      query: {
        newName: newName,
      },
      errors: {
        400: `Bad Request`,
        404: `Image Not Found`,
        409: `Conflict - Duplicate image name`,
        500: `Internal Server Error`,
      },
    });
  }
  /**
   * Upload image(s) to an album
   * Upload one or more image files to the specified album
   * @param id Album ID
   * @param formData
   * @returns any Image uploaded successfully
   * @throws ApiError
   */
  public static postV1AlbumUpload(
    id: string,
    formData: {
      /**
       * Image file(s) to upload
       */
      file: Blob;
    },
  ): CancelablePromise<
    image_service_model_SuccessResponse & {
      data?: Array<image_service_model_Image>;
    }
  > {
    return __request(OpenAPI, {
      method: "POST",
      url: "/v1/album/{id}/upload",
      path: {
        id: id,
      },
      formData: formData,
      mediaType: "multipart/form-data",
      errors: {
        400: `Bad Request`,
        404: `Album Not Found`,
        409: `Conflict`,
        500: `Internal Server Error`,
      },
    });
  }
}
