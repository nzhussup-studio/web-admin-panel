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
     * @returns any OK
     * @throws ApiError
     */
    public static listSkill(): CancelablePromise<Array<Record<string, any>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/base/skill',
        });
    }
    /**
     * @param requestBody
     * @returns base_service_Skill OK
     * @throws ApiError
     */
    public static updateSkill(
        requestBody: base_service_Skill,
    ): CancelablePromise<base_service_Skill> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/v1/base/skill',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns base_service_Skill OK
     * @throws ApiError
     */
    public static createSkill(
        requestBody: base_service_Skill,
    ): CancelablePromise<base_service_Skill> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/base/skill',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static deleteSkill(
        requestBody: base_service_Skill,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/v1/base/skill',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
