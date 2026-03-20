/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { image_service_model_Album } from '../models/image_service_model_Album';
import type { image_service_model_AlbumPreview } from '../models/image_service_model_AlbumPreview';
import type { image_service_model_SuccessResponse } from '../models/image_service_model_SuccessResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AlbumService {
    /**
     * Get album previews
     * Returns a preview list of albums, filtered by type
     * @param type Album type (public, semi-public, private, all)
     * @returns any OK
     * @throws ApiError
     */
    public static getV1Album(
        type: 'public' | 'semi-public' | 'private' | 'all' = 'public',
    ): CancelablePromise<(image_service_model_SuccessResponse & {
        data?: Array<image_service_model_AlbumPreview>;
    })> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/album',
            query: {
                'type': type,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Create a new album
     * Creates an album with basic metadata
     * @param requestBody Album preview data
     * @returns any Created
     * @throws ApiError
     */
    public static postV1Album(
        requestBody: image_service_model_AlbumPreview,
    ): CancelablePromise<(image_service_model_SuccessResponse & {
        data?: image_service_model_AlbumPreview;
    })> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/album',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
                409: `Conflict`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Delete an album
     * Deletes the album and all associated data
     * @param id Album ID
     * @returns image_service_model_SuccessResponse Album deleted successfully
     * @throws ApiError
     */
    public static deleteV1Album(
        id: string,
    ): CancelablePromise<image_service_model_SuccessResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/v1/album/{id}',
            path: {
                'id': id,
            },
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Get a specific album by ID
     * Returns album metadata and images
     * @param id Album ID
     * @returns any OK
     * @throws ApiError
     */
    public static getV1Album1(
        id: string,
    ): CancelablePromise<(image_service_model_SuccessResponse & {
        data?: image_service_model_Album;
    })> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/album/{id}',
            path: {
                'id': id,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Update an album
     * Updates album metadata
     * @param id Album ID
     * @param requestBody Updated album preview data
     * @returns any OK
     * @throws ApiError
     */
    public static putV1Album(
        id: string,
        requestBody: image_service_model_AlbumPreview,
    ): CancelablePromise<(image_service_model_SuccessResponse & {
        data?: image_service_model_AlbumPreview;
    })> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/v1/album/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
}
