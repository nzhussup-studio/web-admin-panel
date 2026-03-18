/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { base_service_Certificate } from '@/gen/api/models/base_service_Certificate';
import type { CancelablePromise } from '@/gen/api/core/CancelablePromise';
import { OpenAPI } from '@/gen/api/core/OpenAPI';
import { request as __request } from '@/gen/api/core/request';
export class CertificateControllerService {
    /**
     * @returns any OK
     * @throws ApiError
     */
    public static listCertificate(): CancelablePromise<Array<Record<string, any>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/base/certificate',
        });
    }
    /**
     * @param requestBody
     * @returns base_service_Certificate OK
     * @throws ApiError
     */
    public static updateCertificate(
        requestBody: base_service_Certificate,
    ): CancelablePromise<base_service_Certificate> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/v1/base/certificate',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns base_service_Certificate OK
     * @throws ApiError
     */
    public static createCertificate(
        requestBody: base_service_Certificate,
    ): CancelablePromise<base_service_Certificate> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/base/certificate',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static deleteCertificate(
        requestBody: base_service_Certificate,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/v1/base/certificate',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
