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
import { CV_TEMPLATES, type CvTemplateId } from "../templates";

interface ExportSummaryProps {
  counts: Record<string, number>;
  onGenerate: () => void;
  templateId?: CvTemplateId;
  onTemplateChange?: (templateId: CvTemplateId) => void;
}

const items = [
  ["basic_info", "Basic information", UserRound],
  ["work_experience", "Work experience", BriefcaseBusiness],
  ["education", "Education", GraduationCap],
  ["skills", "Skills", Settings],
  ["projects", "Projects", Folder],
  ["certificates", "Certifications", Award],
] as const;

export function ExportSummary({
  counts,
  onGenerate,
  templateId = "modern",
  onTemplateChange = () => undefined,
}: ExportSummaryProps) {
  const selectedCount = Object.values(counts).reduce(
    (total, count) => total + count,
    0,
  );

  return (
    <>
      <aside className="export-summary d-none d-xl-block">
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
              {CV_TEMPLATES[templateId].name}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {Object.values(CV_TEMPLATES).map((template) => (
                <Dropdown.Item
                  key={template.id}
                  active={template.id === templateId}
                  onClick={() => onTemplateChange(template.id)}
                >
                  <strong>{template.name}</strong>
                  <small className="d-block text-body-secondary">
                    {template.eyebrow}
                  </small>
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Form.Group>
        <hr />
        <Button className="w-100 justify-content-center" onClick={onGenerate}>
          <FileText size={18} /> Generate CV
        </Button>
      </aside>
      <div className="export-summary-mobile d-xl-none">
        <div className="export-summary-mobile-actions">
          <div>
            <strong>{selectedCount}</strong>
            <span>
              {selectedCount === 1 ? " item selected" : " items selected"}
            </span>
          </div>
          <Button onClick={onGenerate}>
            <FileText size={18} /> Generate CV
          </Button>
        </div>
      </div>
    </>
  );
}
