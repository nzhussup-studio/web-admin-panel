import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

type BasicInfo = Record<string, string>;

type Props = {
  basicInfo: BasicInfo;
  onBasicInfoChange: (key: string, value: string) => void;
};

const CvGeneratorBasicInfoCard = ({ basicInfo, onBasicInfoChange }: Props) => (
  <Card className="rounded-4 app-interactive-card mt-4">
    <Card.Body className="p-4 app-card-body">
      <Card.Title className="fw-semibold mb-4 app-card-title">
        Basic Information
      </Card.Title>
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
  </Card>
);

export default CvGeneratorBasicInfoCard;
