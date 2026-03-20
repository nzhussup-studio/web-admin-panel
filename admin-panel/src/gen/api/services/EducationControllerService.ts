/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { base_service_Education } from "../models/base_service_Education";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class EducationControllerService {
  /**
   * @returns any OK
   * @throws ApiError
   */
  public static listEducation(): CancelablePromise<Array<Record<string, any>>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v1/base/education",
    });
  }
  /**
   * @param requestBody
   * @returns base_service_Education OK
   * @throws ApiError
   */
  public static updateEducation(
    requestBody: base_service_Education,
  ): CancelablePromise<base_service_Education> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/v1/base/education",
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * @param requestBody
   * @returns base_service_Education OK
   * @throws ApiError
   */
  public static createEducation(
    requestBody: base_service_Education,
  ): CancelablePromise<base_service_Education> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/v1/base/education",
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * @param requestBody
   * @returns any OK
   * @throws ApiError
   */
  public static deleteEducation(
    requestBody: base_service_Education,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/v1/base/education",
      body: requestBody,
      mediaType: "application/json",
    });
  }
}
