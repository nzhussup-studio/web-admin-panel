import type { Dispatch, SetStateAction } from "react";
import Form from "react-bootstrap/Form";
import { MarkdownField } from "@/components/ui/markdown-field";

export type ResourceFormField<T extends object> = {
  key: Extract<keyof T, string>;
  label: string;
  type?: "text" | "url" | "number" | "date" | "textarea" | "markdown";
  required?: boolean;
  rows?: number;
  placeholder?: string;
  format?: (value: unknown) => string;
};

interface ResourceFormProps<T extends object> {
  fields: ResourceFormField<T>[];
  value: Partial<T>;
  onChange: Dispatch<SetStateAction<Partial<T>>>;
}

export function ResourceForm<T extends object>({
  fields,
  value,
  onChange,
}: ResourceFormProps<T>) {
  const updateValue = (field: ResourceFormField<T>, nextValue: string) => {
    onChange((current) => ({
      ...current,
      [field.key]: field.type === "number" ? Number(nextValue) : nextValue,
    }));
  };

  return fields.map((field) => {
    const currentValue = value[field.key];
    const formattedValue = field.format
      ? field.format(currentValue)
      : String(currentValue ?? "");

    if (field.type === "markdown") {
      return (
        <MarkdownField
          key={field.key}
          label={field.label}
          value={formattedValue}
          onChange={(nextValue) => updateValue(field, nextValue)}
          required={field.required}
          rows={field.rows}
        />
      );
    }

    return (
      <Form.Group className="mb-3" key={field.key}>
        <Form.Label>{field.label}</Form.Label>
        {field.type === "textarea" ? (
          <Form.Control
            as="textarea"
            rows={field.rows ?? 3}
            value={formattedValue}
            placeholder={field.placeholder}
            required={field.required}
            onChange={(event) => updateValue(field, event.target.value)}
          />
        ) : (
          <Form.Control
            type={field.type ?? "text"}
            value={formattedValue}
            placeholder={field.placeholder}
            required={field.required}
            onChange={(event) => updateValue(field, event.target.value)}
          />
        )}
      </Form.Group>
    );
  });
}
