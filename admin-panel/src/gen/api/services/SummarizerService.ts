/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class SummarizerService {
  /**
   * Generate professional profile summary
   * Retrieves structured personal data (e.g., work experience, education), generates a professional summary using a large language model (LLM), and returns it in the requested language.
   * @param lang Language code for the summary output. Supported values: 'en' (English), 'kz' (Kazakh), 'de' (German). Defaults to 'en'.
   * @returns string Generated professional summary
   * @throws ApiError
   */
  public static getV1LlmSummarize(lang?: string): CancelablePromise<string> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v1/llm/summarize",
      query: {
        lang: lang,
      },
      errors: {
        500: `Internal server error with error details`,
      },
    });
  }
}
