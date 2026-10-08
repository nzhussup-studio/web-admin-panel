import type { KeyboardEvent, MouseEvent, ReactNode } from "react";
import Form from "react-bootstrap/Form";

interface CvSelectableEntryProps {
  selected: boolean;
  label: ReactNode;
  children?: ReactNode;
  onToggle: () => void;
}

const isNestedControl = (target: EventTarget) =>
  target instanceof Element &&
  Boolean(target.closest("button, a, textarea, select"));

export function CvSelectableEntry({
  selected,
  label,
  children,
  onToggle,
}: CvSelectableEntryProps) {
  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!isNestedControl(event.target)) onToggle();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    onToggle();
  };

  return (
    <div
      className={`cv-generator-entry${selected ? " is-selected" : ""}`}
      role="checkbox"
      aria-checked={selected}
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <Form.Check
        type="checkbox"
        checked={selected}
        readOnly
        tabIndex={-1}
        label={label}
      />
      {children}
    </div>
  );
}
