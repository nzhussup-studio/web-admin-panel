/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { user_service_PublicUserRegistryRequest } from '@/gen/api/models/user_service_PublicUserRegistryRequest';
import type { user_service_User } from '@/gen/api/models/user_service_User';
import type { CancelablePromise } from '@/gen/api/core/CancelablePromise';
import { OpenAPI } from '@/gen/api/core/OpenAPI';
import { request as __request } from '@/gen/api/core/request';
export class PublicUserControllerService {
    /**
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static updateUser(
        requestBody: user_service_User,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/v1/user/public',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static registerUser(
        requestBody: user_service_PublicUserRegistryRequest,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/user/public',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static deleteUser(
        requestBody: user_service_User,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/v1/user/public',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
