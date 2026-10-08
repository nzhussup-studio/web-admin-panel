import type { Dispatch, SetStateAction } from "react";
import Button from "@/components/ui/button";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import type { image_service_model_AlbumType } from "@/api";
import type { AlbumPreviewView } from "../albumData";

interface AlbumFormProps {
  value: Partial<AlbumPreviewView>;
  onChange: Dispatch<SetStateAction<Partial<AlbumPreviewView>>>;
}

export function AlbumForm({ value, onChange }: AlbumFormProps) {
  return (
    <>
      <Form.Group className="mb-3">
        <Form.Label>Album Title</Form.Label>
        <Form.Control
          value={value.title ?? ""}
          onChange={(event) =>
            onChange({ ...value, title: event.target.value })
          }
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Album Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={value.desc ?? ""}
          onChange={(event) => onChange({ ...value, desc: event.target.value })}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Date</Form.Label>
        <Form.Control
          type="date"
          value={value.date ?? ""}
          onChange={(event) => onChange({ ...value, date: event.target.value })}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Type</Form.Label>
        <Dropdown className="bootstrap-select-dropdown">
          <Dropdown.Toggle variant="outline-secondary">
            {value.type || "Select album visibility"}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {(["private", "semi-public", "public"] as const).map((type) => (
              <Dropdown.Item
                key={type}
                active={value.type === type}
                onClick={() =>
                  onChange({
                    ...value,
                    type: type as image_service_model_AlbumType,
                  })
                }
              >
                {type}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Image Preview URL</Form.Label>
        <InputGroup>
          <Form.Control
            value={value.preview_image ?? ""}
            onChange={(event) =>
              onChange({ ...value, preview_image: event.target.value })
            }
          />
          <Button
            variant="outline-secondary"
            onClick={() => onChange({ ...value, preview_image: "" })}
            disabled={!value.preview_image}
          >
            Clear
          </Button>
        </InputGroup>
      </Form.Group>
    </>
  );
}
