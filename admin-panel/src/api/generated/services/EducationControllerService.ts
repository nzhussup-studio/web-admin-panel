/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { base_service_Education } from '../models/base_service_Education';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class EducationControllerService {
    /**
     * @param id
     * @param requestBody
     * @returns base_service_Education OK
     * @throws ApiError
     */
    public static updateAdminEducationRecords(
        id: number,
        requestBody: base_service_Education,
    ): CancelablePromise<base_service_Education> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/v1/admin/education-records/{id}',
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
    public static deleteAdminEducationRecords(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/v1/admin/education-records/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns any OK
     * @throws ApiError
     */
    public static listAdminEducationRecords(): CancelablePromise<Array<Record<string, any>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/admin/education-records',
        });
    }
    /**
     * @param requestBody
     * @returns base_service_Education OK
     * @throws ApiError
     */
    public static createAdminEducationRecords(
        requestBody: base_service_Education,
    ): CancelablePromise<base_service_Education> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/admin/education-records',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
