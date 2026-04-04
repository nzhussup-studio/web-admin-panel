/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { account_service_model_SuccessResponse } from '../models/account_service_model_SuccessResponse';
import type { image_service_model_SuccessResponse } from '../models/image_service_model_SuccessResponse';
import type { llm_service_dto_APIResponse } from '../models/llm_service_dto_APIResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
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
     * @returns llm_service_dto_APIResponse Status OK
     * @throws ApiError
     */
    public static getV1LlmHealth(): CancelablePromise<llm_service_dto_APIResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/llm/health',
            errors: {
                500: `Redis connection failed`,
            },
        });
    }
    /**
     * Health check endpoint
     * Returns 200 OK if the service is up
     * @returns account_service_model_SuccessResponse Service is healthy
     * @throws ApiError
     */
    public static getHealth(): CancelablePromise<account_service_model_SuccessResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/health',
        });
    }
}
