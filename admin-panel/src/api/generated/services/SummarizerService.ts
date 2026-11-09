/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { llm_service_dto_GenerationRequest } from '../models/llm_service_dto_GenerationRequest';
import type { llm_service_dto_SummaryResponse } from '../models/llm_service_dto_SummaryResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SummarizerService {
    /**
     * Get summary or generation status
     * @param language Language
     * @returns llm_service_dto_SummaryResponse Generated summary
     * @throws ApiError
     */
    public static getV1LlmSummaries(
        language: 'en' | 'kk' | 'de',
    ): CancelablePromise<llm_service_dto_SummaryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/llm/summaries/{language}',
            path: {
                'language': language,
            },
            errors: {
                400: `Invalid language`,
                404: `No summary or active generation`,
                500: `Internal server error`,
                503: `Generation failed`,
            },
        });
    }
    /**
     * Start or join summary generation
     * Returns a current cached summary or starts missing and stale language summaries in parallel.
     * @param requestBody Requested language
     * @returns llm_service_dto_SummaryResponse Current summary
     * @throws ApiError
     */
    public static postV1LlmSummariesGenerations(
        requestBody: llm_service_dto_GenerationRequest,
    ): CancelablePromise<llm_service_dto_SummaryResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/llm/summaries/generations',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request`,
                500: `Internal server error`,
            },
        });
    }
}
