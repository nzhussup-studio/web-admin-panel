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
     * @returns base_service_CvGeneratorPreference OK
     * @throws ApiError
     */
    public static listAdminCvGeneratorPreferences(): CancelablePromise<base_service_CvGeneratorPreference> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/admin/cv-generator-preferences',
        });
    }
    /**
     * @param requestBody
     * @returns base_service_CvGeneratorPreference OK
     * @throws ApiError
     */
    public static updateAdminCvGeneratorPreferences(
        requestBody: base_service_CvGeneratorPreference,
    ): CancelablePromise<base_service_CvGeneratorPreference> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/v1/admin/cv-generator-preferences',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
