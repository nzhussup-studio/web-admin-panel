/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { base_service_Certificate } from '../models/base_service_Certificate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CertificateControllerService {
    /**
     * @param id
     * @param requestBody
     * @returns base_service_Certificate OK
     * @throws ApiError
     */
    public static updateAdminCertificates(
        id: number,
        requestBody: base_service_Certificate,
    ): CancelablePromise<base_service_Certificate> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/v1/admin/certificates/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any OK
     * @throws ApiError
     */
    public static deleteAdminCertificates(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/v1/admin/certificates/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns any OK
     * @throws ApiError
     */
    public static listAdminCertificates(): CancelablePromise<Array<Record<string, any>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/admin/certificates',
        });
    }
    /**
     * @param requestBody
     * @returns base_service_Certificate OK
     * @throws ApiError
     */
    public static createAdminCertificates(
        requestBody: base_service_Certificate,
    ): CancelablePromise<base_service_Certificate> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/admin/certificates',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
