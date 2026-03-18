/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { image_service_model_AlbumType } from '@/gen/api/models/image_service_model_AlbumType';
import type { image_service_model_Image } from '@/gen/api/models/image_service_model_Image';
export type image_service_model_Album = {
    date?: string;
    desc?: string;
    id?: string;
    images?: Array<image_service_model_Image>;
    title: string;
    type: image_service_model_AlbumType;
};

