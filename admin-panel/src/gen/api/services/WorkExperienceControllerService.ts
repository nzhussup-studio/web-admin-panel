/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { base_service_WorkExperience } from "../models/base_service_WorkExperience";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class WorkExperienceControllerService {
  /**
   * @returns any OK
   * @throws ApiError
   */
  public static listWorkExperience(): CancelablePromise<
    Array<Record<string, any>>
  > {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v1/base/work-experience",
    });
  }
  /**
   * @param requestBody
   * @returns base_service_WorkExperience OK
   * @throws ApiError
   */
  public static updateWorkExperience(
    requestBody: base_service_WorkExperience,
  ): CancelablePromise<base_service_WorkExperience> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/v1/base/work-experience",
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * @param requestBody
   * @returns base_service_WorkExperience OK
   * @throws ApiError
   */
  public static createWorkExperience(
    requestBody: base_service_WorkExperience,
  ): CancelablePromise<base_service_WorkExperience> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/v1/base/work-experience",
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * @param requestBody
   * @returns any OK
   * @throws ApiError
   */
  public static deleteWorkExperience(
    requestBody: base_service_WorkExperience,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/v1/base/work-experience",
      body: requestBody,
      mediaType: "application/json",
    });
  }
}
