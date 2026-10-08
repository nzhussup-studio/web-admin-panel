import { ChevronDown, MoreVertical } from "lucide-react";
import Button from "@/components/ui/button";
import Dropdown from "react-bootstrap/Dropdown";

interface OverflowMenuProps {
  label: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function OverflowMenu({ label, onEdit, onDelete }: OverflowMenuProps) {
  return (
    <>
      <div className="d-none d-md-inline-flex gap-1">
        {onEdit ? (
          <Button size="sm" variant="outline-secondary" onClick={onEdit}>
            Edit
          </Button>
        ) : null}
        <Dropdown align="end">
          <Dropdown.Toggle
            as={Button}
            size="sm"
            variant="outline-secondary"
            aria-label={label}
          >
            <ChevronDown size={15} />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {onDelete ? (
              <Dropdown.Item className="text-danger" onClick={onDelete}>
                Delete
              </Dropdown.Item>
            ) : null}
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <Dropdown align="end" className="d-md-none">
        <Dropdown.Toggle
          as={Button}
          variant="outline-secondary"
          className="mobile-overflow-toggle"
          aria-label={label}
        >
          <MoreVertical size={20} />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {onEdit ? <Dropdown.Item onClick={onEdit}>Edit</Dropdown.Item> : null}
          {onDelete ? (
            <Dropdown.Item className="text-danger" onClick={onDelete}>
              Delete
            </Dropdown.Item>
          ) : null}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
}
