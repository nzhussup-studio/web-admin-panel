import type { Dispatch, FormEvent, SetStateAction } from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import type { llm_service_dto_ConfigurationRequest } from "@/api";

export type PromptLanguage = "en" | "de" | "kk";
const languageLabels: Record<PromptLanguage, string> = {
  en: "English",
  de: "German",
  kk: "Kazakh",
};

interface ModelSettingsFormProps {
  value: llm_service_dto_ConfigurationRequest;
  onChange: Dispatch<SetStateAction<llm_service_dto_ConfigurationRequest>>;
  activePrompt: PromptLanguage;
  onPromptChange: (language: PromptLanguage) => void;
  disabled: boolean;
  onSubmit: (event: FormEvent) => void;
}

export function ModelSettingsForm({
  value,
  onChange,
  activePrompt,
  onPromptChange,
  disabled,
  onSubmit,
}: ModelSettingsFormProps) {
  const promptKey = `system_prompt_${activePrompt}` as const;
  return (
    <Card>
      <Card.Header>
        <h2>Model settings</h2>
      </Card.Header>
      <Card.Body className="p-4">
        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-4" controlId="modelName">
            <Form.Label>Model name</Form.Label>
            <Form.Control
              value={value.model ?? ""}
              onChange={(event) =>
                onChange({ ...value, model: event.target.value })
              }
              disabled={disabled}
            />
          </Form.Group>
          <Form.Check
            className="mb-4"
            type="switch"
            id="parallel-generation"
            label="Enable parallel generation"
            checked={Boolean(value.enable_parallel_generation)}
            onChange={(event) =>
              onChange({
                ...value,
                enable_parallel_generation: event.target.checked,
              })
            }
          />
          <Nav
            variant="tabs"
            activeKey={activePrompt}
            onSelect={(key) => onPromptChange((key ?? "en") as PromptLanguage)}
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
              value={value[promptKey] ?? ""}
              onChange={(event) =>
                onChange({ ...value, [promptKey]: event.target.value })
              }
            />
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );
}
