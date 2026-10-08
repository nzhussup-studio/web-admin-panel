import { Sparkles } from "lucide-react";
import Button from "@/components/ui/button";
import Card from "react-bootstrap/Card";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";

const languageLabels = { en: "English", de: "German", kk: "Kazakh" } as const;

interface SummaryTesterProps {
  language: string;
  summary: string;
  pending: boolean;
  onLanguageChange: (value: string) => void;
  onGenerate: () => void;
}

export function SummaryTester({
  language,
  summary,
  pending,
  onLanguageChange,
  onGenerate,
}: SummaryTesterProps) {
  return (
    <Card>
      <Card.Header>
        <h2>Test summary</h2>
      </Card.Header>
      <Card.Body className="p-4">
        <Form.Group className="mb-3" controlId="summaryLanguage">
          <Form.Label>Language</Form.Label>
          <Dropdown className="bootstrap-select-dropdown">
            <Dropdown.Toggle variant="outline-secondary">
              {languageLabels[language as keyof typeof languageLabels] ??
                language}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {Object.entries(languageLabels).map(([value, label]) => (
                <Dropdown.Item
                  key={value}
                  active={language === value}
                  onClick={() => onLanguageChange(value)}
                >
                  {label}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Form.Group>
        <Button
          variant="outline-primary"
          className="w-100 mb-4"
          onClick={onGenerate}
          disabled={pending}
        >
          <Sparkles size={17} /> {pending ? "Generating…" : "Generate summary"}
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
  );
}
