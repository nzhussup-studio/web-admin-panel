import { ConfigurationService, SummarizerService } from "@/api";

export const getLlmConfiguration = () =>
  ConfigurationService.getV1AdminLlmConfiguration();
export const generateSummary = (language: string) =>
  SummarizerService.postV1LlmSummaries(language);
