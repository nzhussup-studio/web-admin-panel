import Button from "@/components/ui/button";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import {
  Award,
  BriefcaseBusiness,
  FileText,
  Folder,
  GraduationCap,
  Settings,
  UserRound,
} from "lucide-react";

interface ExportSummaryProps {
  counts: Record<string, number>;
  onGenerate: () => void;
}

const items = [
  ["basic_info", "Basic information", UserRound],
  ["work_experience", "Work experience", BriefcaseBusiness],
  ["education", "Education", GraduationCap],
  ["skills", "Skills", Settings],
  ["projects", "Projects", Folder],
  ["certificates", "Certifications", Award],
] as const;

export function ExportSummary({ counts, onGenerate }: ExportSummaryProps) {
  return (
    <aside className="export-summary">
      <h2>Export summary</h2>
      <div className="export-summary-list">
        {items.map(([key, label, Icon]) => (
          <div key={key}>
            <Icon size={19} />
            <span>{label}</span>
            <strong>{counts[key] ?? 0}</strong>
          </div>
        ))}
      </div>
      <hr />
      <Form.Group className="mb-3">
        <Form.Label>Template</Form.Label>
        <Dropdown className="bootstrap-select-dropdown">
          <Dropdown.Toggle variant="outline-secondary">
            Standard
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item active>Standard</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Form.Group>
      <hr />
      <Button className="w-100 justify-content-center" onClick={onGenerate}>
        <FileText size={18} /> Generate CV
      </Button>
    </aside>
  );
}
