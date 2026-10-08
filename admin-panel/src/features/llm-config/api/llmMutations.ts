import {
  ConfigurationService,
  type llm_service_dto_ConfigurationRequest,
} from "@/api";

export const saveLlmConfiguration = (
  configuration: llm_service_dto_ConfigurationRequest,
) => ConfigurationService.putV1LlmConfiguration(configuration);
