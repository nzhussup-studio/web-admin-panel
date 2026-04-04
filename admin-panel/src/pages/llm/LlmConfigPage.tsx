import { useCallback, useEffect, useState, type FormEvent } from "react";
import Header from "@/components/layout/Header";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import Alert from "react-bootstrap/Alert";
import { useNavigate } from "react-router-dom";
import {
  ConfigurationService,
  SummarizerService,
  type llm_service_dto_ConfigurationRequest,
} from "@/lib/api/client";
import { useOptionalGlobalAlert } from "@/hooks/alerts/useOptionalGlobalAlert";
import { getApiErrorMessage } from "@/lib/api/errors";
import { BackCircleIcon } from "@/assets/icons";

const LlmConfigPage = () => {
  const navigate = useNavigate();
  const { triggerAlert } = useOptionalGlobalAlert();
  const [modelName, setModelName] = useState("");
  const [systemPromptEN, setSystemPromptEN] = useState("");
  const [systemPromptDE, setSystemPromptDE] = useState("");
  const [systemPromptKZ, setSystemPromptKZ] = useState("");
  const [enableBackgroundGen, setEnableBackgroundGen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [summaryErrorMessage, setSummaryErrorMessage] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [generatedSummary, setGeneratedSummary] = useState("");

  const loadConfiguration = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const config = await ConfigurationService.getV1LlmConfiguration();
      setModelName(config.model || "");
      setSystemPromptEN(config.system_prompt_en || "");
      setSystemPromptDE(config.system_prompt_de || "");
      setSystemPromptKZ(config.system_prompt_kz || "");
      setEnableBackgroundGen(Boolean(config.enable_parallel_generation));
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        "Failed to load LLM configuration",
      );
      setErrorMessage(message);
      triggerAlert(message, "danger");
    } finally {
      setIsLoading(false);
    }
  }, [triggerAlert]);

  useEffect(() => {
    void loadConfiguration();
  }, [loadConfiguration]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!modelName.trim()) {
      const message = "Model name is required.";
      setErrorMessage(message);
      triggerAlert(message, "warning");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    const payload: llm_service_dto_ConfigurationRequest = {
      model: modelName.trim(),
      system_prompt_en: systemPromptEN,
      system_prompt_de: systemPromptDE,
      system_prompt_kz: systemPromptKZ,
      enable_parallel_generation: enableBackgroundGen,
    };

    try {
      const updated = await ConfigurationService.putV1LlmConfiguration(payload);
      setModelName(updated.model || "");
      setSystemPromptEN(updated.system_prompt_en || "");
      setSystemPromptDE(updated.system_prompt_de || "");
      setSystemPromptKZ(updated.system_prompt_kz || "");
      setEnableBackgroundGen(Boolean(updated.enable_parallel_generation));
      triggerAlert("LLM configuration saved.", "success");
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        "Failed to save LLM configuration",
      );
      setErrorMessage(message);
      triggerAlert(message, "danger");
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    setSummaryErrorMessage("");

    try {
      const response =
        await SummarizerService.getV1LlmSummarize(selectedLanguage);
      setGeneratedSummary(response.message || "");
      triggerAlert("Summary generated.", "success");
    } catch (error) {
      const message = getApiErrorMessage(error, "Failed to generate summary");
      setSummaryErrorMessage(message);
      triggerAlert(message, "danger");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Header text={"LLM Configuration"} />

      <Container className="my-5">
        <Button
          variant="outline-secondary"
          className="d-inline-flex align-items-center gap-2 mb-4"
          onClick={() => navigate(-1)}
        >
          <BackCircleIcon width={16} height={16} />
          Back
        </Button>
        <Form className="p-4 rounded shadow-sm border" onSubmit={handleSubmit}>
          <Stack gap={3}>
            {isLoading && (
              <Alert variant="info">Loading configuration...</Alert>
            )}
            {errorMessage ? (
              <Alert variant="danger">{errorMessage}</Alert>
            ) : null}

            <Form.Group controlId="modelName">
              <Form.Label>Model Name</Form.Label>
              <Form.Control
                type="text"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                placeholder="Enter model name"
                disabled={isLoading || isSaving}
              />
            </Form.Group>

            <Form.Group controlId="systemPromptEN">
              <Form.Label>System Prompt (EN)</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={systemPromptEN}
                onChange={(e) => setSystemPromptEN(e.target.value)}
                disabled={isLoading || isSaving}
              />
            </Form.Group>

            <Form.Group controlId="systemPromptDE">
              <Form.Label>System Prompt (DE)</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={systemPromptDE}
                onChange={(e) => setSystemPromptDE(e.target.value)}
                disabled={isLoading || isSaving}
              />
            </Form.Group>

            <Form.Group controlId="systemPromptKZ">
              <Form.Label>System Prompt (KZ)</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={systemPromptKZ}
                onChange={(e) => setSystemPromptKZ(e.target.value)}
                disabled={isLoading || isSaving}
              />
            </Form.Group>

            <Form.Check
              id="enableBackgroundGen"
              type="checkbox"
              label="Enable Background Generation"
              checked={enableBackgroundGen}
              onChange={(e) => setEnableBackgroundGen(e.target.checked)}
              disabled={isLoading || isSaving}
            />

            <div className="d-flex gap-2">
              <Button type="submit" disabled={isLoading || isSaving}>
                {isSaving ? "Saving..." : "Save Configuration"}
              </Button>
              <Button
                type="button"
                variant="outline-secondary"
                disabled={isLoading || isSaving}
                onClick={() => void loadConfiguration()}
              >
                Reload
              </Button>
            </div>
          </Stack>
        </Form>

        <div className="p-4 rounded shadow-sm border mt-4">
          <Stack gap={3}>
            <h5 className="mb-0">Generate Summary</h5>

            {summaryErrorMessage ? (
              <Alert variant="danger" className="mb-0">
                {summaryErrorMessage}
              </Alert>
            ) : null}

            <Form.Group controlId="summaryLanguage">
              <Form.Label>Language</Form.Label>
              <Form.Select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                disabled={isGenerating}
              >
                <option value="en">English (en)</option>
                <option value="kz">Kazakh (kz)</option>
                <option value="de">German (de)</option>
              </Form.Select>
            </Form.Group>

            <div className="d-flex gap-2">
              <Button
                type="button"
                onClick={() => void handleGenerateSummary()}
                disabled={isGenerating}
              >
                {isGenerating ? "Generating..." : "Generate Summary"}
              </Button>
            </div>

            {generatedSummary ? (
              <Form.Group controlId="generatedSummary">
                <Form.Label>Generated Summary</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={8}
                  value={generatedSummary}
                  readOnly
                />
              </Form.Group>
            ) : null}
          </Stack>
        </div>
      </Container>
    </>
  );
};

export default LlmConfigPage;
