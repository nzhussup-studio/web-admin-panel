import { ConfigurationService, SummarizerService } from "@/api";

export const getLlmConfiguration = () =>
  ConfigurationService.getV1AdminLlmConfiguration();

const wait = (milliseconds: number) =>
  new Promise((resolve) => window.setTimeout(resolve, milliseconds));

export const generateSummary = async (language: string) => {
  const selectedLanguage = language as "en" | "kk" | "de";
  let response = await SummarizerService.postV1LlmSummariesGenerations({
    language: selectedLanguage,
  });

  for (let poll = 0; response.status === "generating" && poll < 60; poll += 1) {
    await wait(response.poll_after_ms ?? 1500);
    response = await SummarizerService.getV1LlmSummaries(selectedLanguage);
  }

  if (response.status !== "completed" || !response.summary) {
    throw new Error("Summary generation did not complete");
  }
  return response;
};
