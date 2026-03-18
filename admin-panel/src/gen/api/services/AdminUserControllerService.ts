/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { user_service_AdminUserRegistryRequest } from '@/gen/api/models/user_service_AdminUserRegistryRequest';
import type { user_service_User } from '@/gen/api/models/user_service_User';
import type { CancelablePromise } from '@/gen/api/core/CancelablePromise';
import { OpenAPI } from '@/gen/api/core/OpenAPI';
import { request as __request } from '@/gen/api/core/request';
export class AdminUserControllerService {
    /**
     * @returns user_service_User OK
     * @throws ApiError
     */
    public static findAll(): CancelablePromise<Array<user_service_User>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/user/admin',
        });
    }
    /**
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static updateUser1(
        requestBody: user_service_User,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/v1/user/admin',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static registerUser1(
        requestBody: user_service_AdminUserRegistryRequest,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/user/admin',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static deleteUser1(
        requestBody: user_service_User,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/v1/user/admin',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
