import Button from "@/components/ui/button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

interface RenameImageFieldProps {
  currentId?: string;
  value: string;
  onChange: (value: string) => void;
}

export function RenameImageField({
  currentId,
  value,
  onChange,
}: RenameImageFieldProps) {
  return (
    <>
      <div className="album-rename-current">
        <span>Current image ID</span>
        <strong>{currentId}</strong>
      </div>
      <Form.Group className="mt-4">
        <Form.Label>New image ID</Form.Label>
        <InputGroup>
          <Form.Control
            value={value}
            onChange={(event) => onChange(event.target.value)}
            required
          />
          <Button
            variant="outline-secondary"
            onClick={() => onChange("")}
            disabled={!value}
          >
            Clear
          </Button>
        </InputGroup>
      </Form.Group>
    </>
  );
}
