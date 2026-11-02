/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { base_service_Certificate } from '../models/base_service_Certificate';
import type { base_service_Education } from '../models/base_service_Education';
import type { base_service_Project } from '../models/base_service_Project';
import type { base_service_Skill } from '../models/base_service_Skill';
import type { base_service_WorkExperience } from '../models/base_service_WorkExperience';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PublicContentControllerService {
    /**
     * @returns base_service_WorkExperience OK
     * @throws ApiError
     */
    public static listWorkExperiences(): CancelablePromise<Array<base_service_WorkExperience>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/work-experiences',
        });
    }
    /**
     * @returns base_service_Skill OK
     * @throws ApiError
     */
    public static listSkills(): CancelablePromise<Array<base_service_Skill>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/skills',
        });
    }
    /**
     * @returns base_service_Project OK
     * @throws ApiError
     */
    public static listProjects(): CancelablePromise<Array<base_service_Project>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/projects',
        });
    }
    /**
     * @returns base_service_Education OK
     * @throws ApiError
     */
    public static listEducationRecords(): CancelablePromise<Array<base_service_Education>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/education-records',
        });
    }
    /**
     * @returns base_service_Certificate OK
     * @throws ApiError
     */
    public static listCertificates(): CancelablePromise<Array<base_service_Certificate>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/certificates',
        });
    }
}
