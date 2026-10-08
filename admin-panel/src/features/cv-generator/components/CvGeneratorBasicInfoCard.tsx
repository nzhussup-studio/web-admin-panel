import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { ChevronDown, ChevronUp, UserRound } from "lucide-react";

type BasicInfo = Record<string, string>;

type Props = {
  basicInfo: BasicInfo;
  onBasicInfoChange: (key: string, value: string) => void;
};

const CvGeneratorBasicInfoCard = ({ basicInfo, onBasicInfoChange }: Props) => {
  const [open, setOpen] = useState(false);
  return (
    <Card className="cv-generator-section">
      <Card.Header className="cv-generator-section-header">
        <UserRound size={21} />
        <Card.Title>Basic information</Card.Title>
        <Badge bg="primary-subtle" text="primary">
          1 selected
        </Badge>
        <Button
          variant="link"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle basic information"
        >
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </Button>
      </Card.Header>
      {open ? (
        <Card.Body className="p-4 app-card-body">
          <Form onSubmit={(e) => e.preventDefault()}>
            <Row className="g-3">
              {Object.entries(basicInfo).map(([key, value]) => (
                <Col key={key} md={key === "about" ? 12 : 6}>
                  <Form.Group controlId={`basic-info-${key}`}>
                    <Form.Label className="text-capitalize fw-semibold">
                      {key.replace(/_/g, " ")}
                    </Form.Label>
                    {key === "about" ? (
                      <Form.Control
                        as="textarea"
                        rows={4}
                        value={String(value ?? "")}
                        onChange={(e) => onBasicInfoChange(key, e.target.value)}
                      />
                    ) : (
                      <Form.Control
                        type="text"
                        value={String(value ?? "")}
                        onChange={(e) => onBasicInfoChange(key, e.target.value)}
                      />
                    )}
                  </Form.Group>
                </Col>
              ))}
            </Row>
          </Form>
        </Card.Body>
      ) : null}
    </Card>
  );
};

export default CvGeneratorBasicInfoCard;
import { useState } from "react";
import Badge from "react-bootstrap/Badge";
import Button from "@/components/ui/button";
