import { useMemo } from "react";
import Badge from "react-bootstrap/Badge";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { Braces, ChevronDown, Settings } from "lucide-react";
import { parseCustomSkillsText } from "./cvGeneratorUtils";
import type { SkillCategoryMode } from "../hooks/useCvGeneratorPreferences";
import CvSkillModeToggle from "./CvSkillModeToggle";

type Props = {
  value: string;
  onChange: (value: string) => void;
  mode: SkillCategoryMode;
  onModeChange: (value: SkillCategoryMode) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const EXAMPLE = `Languages: Java, Go, Python, TypeScript
Platform & Cloud: AWS, Terraform, Kubernetes, Docker
Architecture: Microservices, Event-Driven Architecture, REST APIs`;

const CvSkillCategoriesCard = ({
  value,
  onChange,
  mode,
  onModeChange,
  open,
  onOpenChange,
}: Props) => {
  const categories = useMemo(() => parseCustomSkillsText(value), [value]);
  const nonEmptyLines = value
    .split(/\r?\n/)
    .filter((line) => line.trim()).length;
  const invalidLineCount = nonEmptyLines - categories.length;
  const skillCount = categories.reduce(
    (total, category) => total + category.skills.length,
    0,
  );

  return (
    <Card className={`cv-generator-section${open ? " is-open" : ""}`}>
      <Card.Header
        as="button"
        type="button"
        className="cv-generator-section-header"
        onClick={() => onOpenChange(!open)}
        aria-expanded={open}
      >
        <span className="cv-generator-section-icon">
          <Settings size={19} />
        </span>
        <span className="cv-generator-section-heading">
          <Card.Title>Skills</Card.Title>
          <small>Define one category per line</small>
        </span>
        <Badge bg="primary-subtle" text="primary">
          {categories.length} categories
        </Badge>
        <ChevronDown className="cv-generator-chevron" size={18} />
      </Card.Header>

      {open ? (
        <Card.Body className="cv-generator-section-body cv-custom-skills-body">
          <CvSkillModeToggle value={mode} onChange={onModeChange} />
          <div className="cv-custom-skills-intro">
            <span className="cv-custom-skills-format-icon">
              <Braces size={18} />
            </span>
            <div>
              <strong>Category: skill, skill, skill</strong>
              <span>
                Use a new line for each category. No JSON punctuation or quotes
                required.
              </span>
            </div>
          </div>

          <Form.Group controlId="custom-skills-text">
            <Form.Label>Custom skill categories</Form.Label>
            <Form.Control
              as="textarea"
              rows={9}
              className="cv-custom-skills-input"
              value={value}
              placeholder={EXAMPLE}
              spellCheck={false}
              onChange={(event) => onChange(event.target.value)}
            />
            <div className="cv-custom-skills-status" aria-live="polite">
              <span>
                {categories.length}{" "}
                {categories.length === 1 ? "category" : "categories"}
                {" · "}
                {skillCount} {skillCount === 1 ? "skill" : "skills"}
              </span>
              {invalidLineCount > 0 ? (
                <span className="text-danger">
                  {invalidLineCount} incomplete{" "}
                  {invalidLineCount === 1 ? "line" : "lines"} ignored
                </span>
              ) : (
                <span>Ready for export</span>
              )}
            </div>
          </Form.Group>

          {categories.length > 0 ? (
            <div className="cv-custom-skills-preview">
              {categories.map((category) => (
                <div key={category.id}>
                  <strong>{category.name}</strong>
                  <span>{category.skills.join(" · ")}</span>
                </div>
              ))}
            </div>
          ) : null}
        </Card.Body>
      ) : null}
    </Card>
  );
};

export default CvSkillCategoriesCard;
