import Form from "react-bootstrap/Form";
import { formatLabel } from "./cvGeneratorUtils";

interface DescriptionOverrideFieldProps {
  sectionName: string;
  value: string;
  defaultDescription: string;
  onChange: (value: string) => void;
}

export function DescriptionOverrideField({
  sectionName,
  value,
  defaultDescription,
  onChange,
}: DescriptionOverrideFieldProps) {
  const isProject = sectionName === "projects";
  const placeholder = defaultDescription
    ? `Current: ${defaultDescription.slice(0, 140)}${defaultDescription.length > 140 ? "..." : ""}`
    : isProject
      ? "Type an optional project description..."
      : `Type a custom ${formatLabel(sectionName)} description...`;

  return (
    <Form.Group className="mt-2">
      <Form.Label>
        {isProject ? "Project description" : "Custom description"}
        <span className="text-body-secondary fw-normal"> (optional)</span>
      </Form.Label>
      <Form.Control
        as="textarea"
        rows={3}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </Form.Group>
  );
}
