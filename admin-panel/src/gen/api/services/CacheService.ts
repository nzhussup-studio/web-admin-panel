/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { image_service_model_SuccessResponse } from '@/gen/api/models/image_service_model_SuccessResponse';
import type { CancelablePromise } from '@/gen/api/core/CancelablePromise';
import { OpenAPI } from '@/gen/api/core/OpenAPI';
import { request as __request } from '@/gen/api/core/request';
export class CacheService {
    /**
     * Clear the image cache
     * This endpoint clears the server-side cache for images.
     * @returns image_service_model_SuccessResponse Cache cleared successfully
     * @throws ApiError
     */
    public static deleteV1AlbumCache(): CancelablePromise<image_service_model_SuccessResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/v1/album/cache',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
}
