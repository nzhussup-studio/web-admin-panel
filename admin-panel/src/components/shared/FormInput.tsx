import type {
  ChangeEvent,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

type FormInputChangeEvent =
  | ChangeEvent<HTMLInputElement>
  | ChangeEvent<HTMLTextAreaElement>
  | ChangeEvent<HTMLSelectElement>
  | { target: { value: string } };

interface FormInputProps {
  label?: ReactNode;
  type?: string;
  value?: string | number | readonly string[];
  onChange: (event: FormInputChangeEvent) => void;
  required?: boolean;
  rows?: number;
  options?: string[];
}

const FormInput = ({
  label,
  type = "text",
  value,
  onChange,
  required = false,
  rows = 3,
  options = [],
}: FormInputProps) => {
  const isDate = type === "date";
  const isClearableText = type === "clearable_text"; // Check if it's clearable_text
  const normalizedValue: string | number | string[] | undefined =
    typeof value === "string" || typeof value === "number"
      ? value
      : value
        ? Array.from(value)
        : undefined;

  return (
    <div className='mb-3 position-relative'>
      <Form.Label>{label}</Form.Label>

      {type === "textarea" ? (
        <Form.Control
          as='textarea'
          value={normalizedValue}
          onChange={onChange as TextareaHTMLAttributes<HTMLTextAreaElement>["onChange"]}
          required={required}
          rows={rows}
        />
      ) : type === "select" ? (
        <Form.Select
          value={normalizedValue}
          onChange={onChange as SelectHTMLAttributes<HTMLSelectElement>["onChange"]}
          required={required}
        >
          <option value='' disabled>
            Select a role
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Form.Select>
      ) : (
        <>
          <Form.Control
            type={type}
            className='pe-5'
            value={normalizedValue}
            onChange={onChange}
            required={required}
          />
          {/* Show clear button only for clearable_text inputs with a value */}
          {isClearableText && value && (
            <Button
              type='button'
              onClick={() => onChange({ target: { value: "" } })}
              variant='outline-secondary'
              size='sm'
              className='position-absolute top-50 end-0 translate-middle-y me-2'
              style={{ zIndex: 10 }}
            >
              &times;
            </Button>
          )}
          {/* Show clear button for date inputs */}
          {isDate && value && (
            <Button
              type='button'
              onClick={() => onChange({ target: { value: "" } })}
              variant='outline-secondary'
              size='sm'
              className='position-absolute top-50 end-0 translate-middle-y me-2'
              style={{ zIndex: 10 }}
            >
              &times;
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default FormInput;
