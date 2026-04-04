/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { llm_service_dto_APIResponse } from '../models/llm_service_dto_APIResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SummarizerService {
    /**
     * Generate professional profile summary
     * Retrieves structured personal data (e.g., work experience, education), generates a professional summary using a large language model (LLM), and returns it in the requested language.
     * @param lang
     * @returns llm_service_dto_APIResponse Generated professional summary
     * @throws ApiError
     */
    public static getV1LlmSummarize(
        lang?: string,
    ): CancelablePromise<llm_service_dto_APIResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/llm/summarize',
            query: {
                'lang': lang,
            },
            errors: {
                400: `Invalid query parameters`,
                500: `Internal server error with error details`,
            },
        });
    }
}
