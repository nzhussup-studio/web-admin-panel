/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { image_service_model_Album } from '../models/image_service_model_Album';
import type { image_service_model_AlbumPreview } from '../models/image_service_model_AlbumPreview';
import type { image_service_model_SuccessResponse } from '../models/image_service_model_SuccessResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PublicAlbumService {
    /**
     * List public albums
     * @returns any OK
     * @throws ApiError
     */
    public static getV1Albums(): CancelablePromise<(image_service_model_SuccessResponse & {
        data?: Array<image_service_model_AlbumPreview>;
    })> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/albums',
        });
    }
    /**
     * Get a publicly accessible album
     * @param id Album ID
     * @returns any OK
     * @throws ApiError
     */
    public static getV1Albums1(
        id: string,
    ): CancelablePromise<(image_service_model_SuccessResponse & {
        data?: image_service_model_Album;
    })> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/albums/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Not Found`,
            },
        });
    }
}
