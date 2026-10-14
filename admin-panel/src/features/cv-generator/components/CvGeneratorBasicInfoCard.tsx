import { useState } from "react";
import Badge from "react-bootstrap/Badge";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { ChevronDown, UserRound } from "lucide-react";
import type { BasicInfoFieldDefinition } from "../templates";

type BasicInfo = Record<string, string>;

type Props = {
  basicInfo: BasicInfo;
  onBasicInfoChange: (key: string, value: string) => void;
  fields: BasicInfoFieldDefinition[];
  title: string;
  description: string;
};

const CvGeneratorBasicInfoCard = ({
  basicInfo,
  onBasicInfoChange,
  fields,
  title,
  description,
}: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <Card className={`cv-generator-section${open ? " is-open" : ""}`}>
      <Card.Header
        as="button"
        type="button"
        className="cv-generator-section-header"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        <span className="cv-generator-section-icon">
          <UserRound size={19} />
        </span>
        <span className="cv-generator-section-heading">
          <Card.Title>{title}</Card.Title>
          <small>{description}</small>
        </span>
        <Badge bg="primary-subtle" text="primary">
          Included
        </Badge>
        <ChevronDown className="cv-generator-chevron" size={18} />
      </Card.Header>
      {open ? (
        <Card.Body className="cv-generator-section-body">
          <Form onSubmit={(event) => event.preventDefault()}>
            <Row className="g-4">
              {fields.map(
                ({ key, label, type, autoComplete, placeholder, wide }) => (
                  <Col key={key} md={wide ? 12 : 6}>
                    <Form.Group controlId={`basic-info-${key}`}>
                      <Form.Label>{label}</Form.Label>
                      <Form.Control
                        type={type ?? "text"}
                        autoComplete={autoComplete}
                        placeholder={placeholder}
                        value={basicInfo[key] ?? ""}
                        onChange={(event) =>
                          onBasicInfoChange(key, event.target.value)
                        }
                      />
                    </Form.Group>
                  </Col>
                ),
              )}
              <Col xs={12}>
                <Form.Group controlId="basic-info-about">
                  <Form.Label>Professional summary</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    value={basicInfo.about ?? ""}
                    onChange={(event) =>
                      onBasicInfoChange("about", event.target.value)
                    }
                  />
                  <Form.Text>
                    Keep this concise—two or three sentences work best.
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      ) : null}
    </Card>
  );
};

export default CvGeneratorBasicInfoCard;
