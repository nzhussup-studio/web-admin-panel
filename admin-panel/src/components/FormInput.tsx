import type {
  ChangeEvent,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

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

  return (
    <div className='mb-3 position-relative'>
      <label className='form-label'>{label}</label>

      {type === "textarea" ? (
        <textarea
          className='form-control'
          value={value}
          onChange={onChange as TextareaHTMLAttributes<HTMLTextAreaElement>["onChange"]}
          required={required}
          rows={rows}
        />
      ) : type === "select" ? (
        <select
          className='form-control'
          value={value}
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
        </select>
      ) : (
        <>
          <input
            type={type}
            className='form-control pe-5'
            value={value}
            onChange={onChange}
            required={required}
          />
          {/* Show clear button only for clearable_text inputs with a value */}
          {isClearableText && value && (
            <button
              type='button'
              onClick={() => onChange({ target: { value: "" } })}
              className='btn btn-sm btn-outline-secondary position-absolute top-50 end-0 translate-middle-y me-2'
              style={{ zIndex: 10 }}
            >
              &times;
            </button>
          )}
          {/* Show clear button for date inputs */}
          {isDate && value && (
            <button
              type='button'
              onClick={() => onChange({ target: { value: "" } })}
              className='btn btn-sm btn-outline-secondary position-absolute top-50 end-0 translate-middle-y me-2'
              style={{ zIndex: 10 }}
            >
              &times;
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default FormInput;
