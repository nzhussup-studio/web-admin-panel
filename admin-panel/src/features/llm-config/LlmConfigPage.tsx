import { useEffect, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Save } from "lucide-react";
import Alert from "react-bootstrap/Alert";
import Button from "@/components/ui/button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import {
  getApiErrorMessage,
  queryKeys,
  type llm_service_dto_ConfigurationRequest,
} from "@/api";
import { PageHeader } from "@/components/layout/page-header";
import { useOptionalGlobalAlert } from "@/providers/alerts";
import {
  generateSummary,
  getLlmConfiguration,
  saveLlmConfiguration,
} from "./api";
import {
  ModelSettingsForm,
  SummaryTester,
  type PromptLanguage,
} from "./components";

const LlmConfigPage = () => {
  const queryClient = useQueryClient();
  const { triggerAlert } = useOptionalGlobalAlert();
  const [form, setForm] = useState<llm_service_dto_ConfigurationRequest>({
    model: "",
  });
  const [activePrompt, setActivePrompt] = useState<PromptLanguage>("en");
  const [summaryLanguage, setSummaryLanguage] = useState("en");
  const [summary, setSummary] = useState("");
  const configuration = useQuery({
    queryKey: queryKeys.llm.configuration,
    queryFn: getLlmConfiguration,
  });

  useEffect(() => {
    if (!configuration.data) return;
    setForm({
      model: configuration.data.model ?? "",
      system_prompt_en: configuration.data.system_prompt_en ?? "",
      system_prompt_de: configuration.data.system_prompt_de ?? "",
      system_prompt_kk: configuration.data.system_prompt_kk ?? "",
      enable_parallel_generation: Boolean(
        configuration.data.enable_parallel_generation,
      ),
    });
  }, [configuration.data]);

  const saveConfiguration = useMutation({
    mutationFn: saveLlmConfiguration,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.llm.configuration,
      });
      triggerAlert("Configuration saved", "success");
    },
    onError: (error) =>
      triggerAlert(
        getApiErrorMessage(error, "Failed to save configuration"),
        "danger",
      ),
  });
  const summaryMutation = useMutation({
    mutationFn: generateSummary,
    onSuccess: (response) => setSummary(response.message ?? ""),
    onError: (error) =>
      triggerAlert(
        getApiErrorMessage(error, "Failed to generate summary"),
        "danger",
      ),
  });
  const submit = (event: FormEvent) => {
    event.preventDefault();
    saveConfiguration.mutate(form);
  };

  return (
    <>
      <PageHeader
        text="LLM configuration"
        description="Configure the model and professional-summary generation."
        actions={
          <Button
            onClick={() => saveConfiguration.mutate(form)}
            disabled={saveConfiguration.isPending || configuration.isPending}
          >
            <Save size={17} />{" "}
            {saveConfiguration.isPending ? "Saving…" : "Save changes"}
          </Button>
        }
      />
      <Container fluid="xl" className="page-content">
        {configuration.isError ? (
          <Alert variant="danger">
            {getApiErrorMessage(
              configuration.error,
              "Failed to load configuration",
            )}
          </Alert>
        ) : null}
        <Row className="g-4">
          <Col xl={7}>
            <ModelSettingsForm
              value={form}
              onChange={setForm}
              activePrompt={activePrompt}
              onPromptChange={setActivePrompt}
              disabled={configuration.isPending}
              onSubmit={submit}
            />
          </Col>
          <Col xl={5}>
            <SummaryTester
              language={summaryLanguage}
              summary={summary}
              pending={summaryMutation.isPending}
              onLanguageChange={setSummaryLanguage}
              onGenerate={() => summaryMutation.mutate(summaryLanguage)}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default LlmConfigPage;
