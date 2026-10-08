import Form from "react-bootstrap/Form";
import MarkdownContent from "./MarkdownContent";

type MarkdownFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  rows?: number;
};

export default function MarkdownField({
  label,
  value,
  onChange,
  required = false,
  rows = 10,
}: MarkdownFieldProps) {
  return (
    <Form.Group className="mb-3">
      <div className="d-flex align-items-baseline justify-content-between gap-3">
        <Form.Label>{label}</Form.Label>
        <span className="app-markdown-badge">Markdown</span>
      </div>
      <Form.Control
        as="textarea"
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        spellCheck
      />
      <Form.Text>
        Supports headings, **bold**, _italics_, links, and nested lists.
      </Form.Text>
      {value.trim() ? (
        <div className="app-markdown-preview">
          <span className="app-markdown-preview-label">Preview</span>
          <MarkdownContent>{value}</MarkdownContent>
        </div>
      ) : null}
    </Form.Group>
  );
}
