/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { llm_service_dto_ConfigurationRequest } from '../models/llm_service_dto_ConfigurationRequest';
import type { llm_service_dto_ConfigurationResponse } from '../models/llm_service_dto_ConfigurationResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ConfigurationService {
    /**
     * Get current LLM configuration
     * Returns active runtime LLM settings such as model, prompts, and parallel generation flag.
     * @returns llm_service_dto_ConfigurationResponse Current configuration
     * @throws ApiError
     */
    public static getV1LlmConfiguration(): CancelablePromise<llm_service_dto_ConfigurationResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/llm/configuration',
        });
    }
    /**
     * Update LLM configuration
     * Updates runtime LLM settings such as model, prompts, and parallel generation flag.
     * @param requestBody Configuration overrides
     * @returns llm_service_dto_ConfigurationResponse Updated configuration
     * @throws ApiError
     */
    public static putV1LlmConfiguration(
        requestBody: llm_service_dto_ConfigurationRequest,
    ): CancelablePromise<llm_service_dto_ConfigurationResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/v1/llm/configuration',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid configuration payload`,
            },
        });
    }
}
