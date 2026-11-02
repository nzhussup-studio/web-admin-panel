/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PublicImageService {
    /**
     * Serve an image from a public or semi-public album
     * @param id Album ID
     * @param imageId Image ID
     * @returns binary OK
     * @throws ApiError
     */
    public static getV1AlbumsImages(
        id: string,
        imageId: string,
    ): CancelablePromise<Blob> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/albums/{id}/images/{imageID}',
            path: {
                'id': id,
                'imageID': imageId,
            },
            errors: {
                404: `Not Found`,
            },
        });
    }
}
