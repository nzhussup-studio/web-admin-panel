import { useEffect, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import { Save, Sparkles } from "lucide-react";
import { queryKeys } from "@/api";
import Header from "@/components/layout/Header";
import {
  ConfigurationService,
  SummarizerService,
  type llm_service_dto_ConfigurationRequest,
} from "@/lib/api/client";
import { getApiErrorMessage } from "@/lib/api/errors";
import { useOptionalGlobalAlert } from "@/hooks/alerts/useOptionalGlobalAlert";

type PromptLanguage = "en" | "de" | "kk";

const languageLabels: Record<PromptLanguage, string> = {
  en: "English",
  de: "German",
  kk: "Kazakh",
};

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
    queryFn: () => ConfigurationService.getV1LlmConfiguration(),
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
    mutationFn: (payload: llm_service_dto_ConfigurationRequest) =>
      ConfigurationService.putV1LlmConfiguration(payload),
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

  const generateSummary = useMutation({
    mutationFn: (language: string) =>
      SummarizerService.getV1LlmSummarize(language),
    onSuccess: (response) => setSummary(response.message ?? ""),
    onError: (error) =>
      triggerAlert(
        getApiErrorMessage(error, "Failed to generate summary"),
        "danger",
      ),
  });

  const promptKey = `system_prompt_${activePrompt}` as const;
  const submit = (event: FormEvent) => {
    event.preventDefault();
    saveConfiguration.mutate(form);
  };

  return (
    <>
      <Header
        eyebrow="Settings / LLM configuration"
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
            <Card>
              <Card.Header>
                <h2>Model settings</h2>
              </Card.Header>
              <Card.Body className="p-4">
                <Form onSubmit={submit}>
                  <Form.Group className="mb-4" controlId="modelName">
                    <Form.Label>Model name</Form.Label>
                    <Form.Control
                      value={form.model ?? ""}
                      onChange={(event) =>
                        setForm({ ...form, model: event.target.value })
                      }
                      disabled={configuration.isPending}
                    />
                  </Form.Group>
                  <Form.Check
                    className="mb-4"
                    type="switch"
                    id="parallel-generation"
                    label="Enable parallel generation"
                    checked={Boolean(form.enable_parallel_generation)}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        enable_parallel_generation: event.target.checked,
                      })
                    }
                  />
                  <Nav
                    variant="tabs"
                    activeKey={activePrompt}
                    onSelect={(key) =>
                      setActivePrompt((key ?? "en") as PromptLanguage)
                    }
                  >
                    {(Object.keys(languageLabels) as PromptLanguage[]).map(
                      (language) => (
                        <Nav.Item key={language}>
                          <Nav.Link eventKey={language}>
                            {languageLabels[language]}
                          </Nav.Link>
                        </Nav.Item>
                      ),
                    )}
                  </Nav>
                  <Form.Group className="mt-3" controlId="systemPrompt">
                    <Form.Label>
                      System prompt ({languageLabels[activePrompt]})
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={10}
                      value={form[promptKey] ?? ""}
                      onChange={(event) =>
                        setForm({ ...form, [promptKey]: event.target.value })
                      }
                    />
                  </Form.Group>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          <Col xl={5}>
            <Card>
              <Card.Header>
                <h2>Test summary</h2>
              </Card.Header>
              <Card.Body className="p-4">
                <Form.Group className="mb-3" controlId="summaryLanguage">
                  <Form.Label>Language</Form.Label>
                  <Form.Select
                    value={summaryLanguage}
                    onChange={(event) => setSummaryLanguage(event.target.value)}
                  >
                    {Object.entries(languageLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Button
                  variant="outline-primary"
                  className="w-100 mb-4"
                  onClick={() => generateSummary.mutate(summaryLanguage)}
                  disabled={generateSummary.isPending}
                >
                  <Sparkles size={17} />{" "}
                  {generateSummary.isPending
                    ? "Generating…"
                    : "Generate summary"}
                </Button>
                <Form.Group controlId="generatedSummary">
                  <Form.Label>Generated summary</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={12}
                    value={summary}
                    readOnly
                    placeholder="Your generated summary will appear here."
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default LlmConfigPage;
