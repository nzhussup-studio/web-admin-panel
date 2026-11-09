import { ConfigurationService, SummarizerService } from "@/api";

const MAX_FRONTEND_WAIT_MS = 20_000;

export const getLlmConfiguration = () =>
  ConfigurationService.getV1AdminLlmConfiguration();

const wait = (milliseconds: number) =>
  new Promise((resolve) => window.setTimeout(resolve, milliseconds));

export const generateSummary = async (language: string) => {
  const selectedLanguage = language as "en" | "kk" | "de";
  let response = await SummarizerService.postV1LlmSummariesGenerations({
    language: selectedLanguage,
  });
	const deadline = Date.now() + MAX_FRONTEND_WAIT_MS;

	while (response.status === "generating" && Date.now() < deadline) {
		const remaining = deadline - Date.now();
		await wait(Math.min(response.poll_after_ms ?? 1500, remaining));
    response = await SummarizerService.getV1LlmSummaries(selectedLanguage);
  }

	if (response.status === "generating") {
		throw new Error("Summary generation is taking longer than expected. Please retry.");
	}
  if (response.status !== "completed" || !response.summary) {
    throw new Error("Summary generation did not complete");
  }
  return response;
};
