/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { base_service_Project } from '../models/base_service_Project';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProjectControllerService {
    /**
     * @param id
     * @param requestBody
     * @returns base_service_Project OK
     * @throws ApiError
     */
    public static updateAdminProjects(
        id: number,
        requestBody: base_service_Project,
    ): CancelablePromise<base_service_Project> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/v1/admin/projects/{id}',
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
    public static deleteAdminProjects(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/v1/admin/projects/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns any OK
     * @throws ApiError
     */
    public static listAdminProjects(): CancelablePromise<Array<Record<string, any>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/admin/projects',
        });
    }
    /**
     * @param requestBody
     * @returns base_service_Project OK
     * @throws ApiError
     */
    public static createAdminProjects(
        requestBody: base_service_Project,
    ): CancelablePromise<base_service_Project> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/admin/projects',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
