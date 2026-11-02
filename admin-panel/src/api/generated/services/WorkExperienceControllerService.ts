/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { base_service_WorkExperience } from '../models/base_service_WorkExperience';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class WorkExperienceControllerService {
    /**
     * @param id
     * @param requestBody
     * @returns base_service_WorkExperience OK
     * @throws ApiError
     */
    public static updateAdminWorkExperiences(
        id: number,
        requestBody: base_service_WorkExperience,
    ): CancelablePromise<base_service_WorkExperience> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/v1/admin/work-experiences/{id}',
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
    public static deleteAdminWorkExperiences(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/v1/admin/work-experiences/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns any OK
     * @throws ApiError
     */
    public static listAdminWorkExperiences(): CancelablePromise<Array<Record<string, any>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/admin/work-experiences',
        });
    }
    /**
     * @param requestBody
     * @returns base_service_WorkExperience OK
     * @throws ApiError
     */
    public static createAdminWorkExperiences(
        requestBody: base_service_WorkExperience,
    ): CancelablePromise<base_service_WorkExperience> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/admin/work-experiences',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
