import { ConfigurationService, SummarizerService } from "@/api";

export const getLlmConfiguration = () =>
  ConfigurationService.getV1LlmConfiguration();
export const generateSummary = (language: string) =>
  SummarizerService.getV1LlmSummarize(language);
