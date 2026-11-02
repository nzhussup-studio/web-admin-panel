/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { base_service_Skill } from '../models/base_service_Skill';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SkillControllerService {
    /**
     * @param id
     * @param requestBody
     * @returns base_service_Skill OK
     * @throws ApiError
     */
    public static updateAdminSkills(
        id: number,
        requestBody: base_service_Skill,
    ): CancelablePromise<base_service_Skill> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/v1/admin/skills/{id}',
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
    public static deleteAdminSkills(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/v1/admin/skills/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns any OK
     * @throws ApiError
     */
    public static listAdminSkills(): CancelablePromise<Array<Record<string, any>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/admin/skills',
        });
    }
    /**
     * @param requestBody
     * @returns base_service_Skill OK
     * @throws ApiError
     */
    public static createAdminSkills(
        requestBody: base_service_Skill,
    ): CancelablePromise<base_service_Skill> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/admin/skills',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
