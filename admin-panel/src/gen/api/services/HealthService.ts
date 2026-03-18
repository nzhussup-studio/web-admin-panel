/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { image_service_model_SuccessResponse } from '@/gen/api/models/image_service_model_SuccessResponse';
import type { CancelablePromise } from '@/gen/api/core/CancelablePromise';
import { OpenAPI } from '@/gen/api/core/OpenAPI';
import { request as __request } from '@/gen/api/core/request';
export class HealthService {
    /**
     * Health check endpoint
     * Returns 200 OK if the service is up
     * @returns image_service_model_SuccessResponse Service is healthy
     * @throws ApiError
     */
    public static getV1AlbumHealth(): CancelablePromise<image_service_model_SuccessResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/album/health',
        });
    }
    /**
     * Health check endpoint
     * Checks the connectivity and health of dependent services, particularly Redis.
     * @returns string Status OK
     * @throws ApiError
     */
    public static getV1Health(): CancelablePromise<Record<string, string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/health',
            errors: {
                500: `Redis connection failed`,
            },
        });
    }
}
