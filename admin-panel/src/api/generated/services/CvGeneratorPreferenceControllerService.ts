/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { base_service_CvGeneratorPreference } from '../models/base_service_CvGeneratorPreference';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CvGeneratorPreferenceControllerService {
    /**
     * @returns any OK
     * @throws ApiError
     */
    public static listCvGeneratorPreference(): CancelablePromise<Array<Record<string, any>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/base/cv-generator-preference',
        });
    }
    /**
     * @param requestBody
     * @returns base_service_CvGeneratorPreference OK
     * @throws ApiError
     */
    public static updateCvGeneratorPreference(
        requestBody: base_service_CvGeneratorPreference,
    ): CancelablePromise<base_service_CvGeneratorPreference> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/v1/base/cv-generator-preference',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns base_service_CvGeneratorPreference OK
     * @throws ApiError
     */
    public static createCvGeneratorPreference(
        requestBody: base_service_CvGeneratorPreference,
    ): CancelablePromise<base_service_CvGeneratorPreference> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/base/cv-generator-preference',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static deleteCvGeneratorPreference(
        requestBody: base_service_CvGeneratorPreference,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/v1/base/cv-generator-preference',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
