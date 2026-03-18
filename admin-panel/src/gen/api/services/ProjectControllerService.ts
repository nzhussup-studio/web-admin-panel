/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { base_service_Project } from '@/gen/api/models/base_service_Project';
import type { CancelablePromise } from '@/gen/api/core/CancelablePromise';
import { OpenAPI } from '@/gen/api/core/OpenAPI';
import { request as __request } from '@/gen/api/core/request';
export class ProjectControllerService {
    /**
     * @returns any OK
     * @throws ApiError
     */
    public static listProject(): CancelablePromise<Array<Record<string, any>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/base/project',
        });
    }
    /**
     * @param requestBody
     * @returns base_service_Project OK
     * @throws ApiError
     */
    public static updateProject(
        requestBody: base_service_Project,
    ): CancelablePromise<base_service_Project> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/v1/base/project',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns base_service_Project OK
     * @throws ApiError
     */
    public static createProject(
        requestBody: base_service_Project,
    ): CancelablePromise<base_service_Project> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/base/project',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static deleteProject(
        requestBody: base_service_Project,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/v1/base/project',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
