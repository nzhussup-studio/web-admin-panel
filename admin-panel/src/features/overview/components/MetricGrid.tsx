import type { LucideIcon } from "lucide-react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

interface Metric {
  label: string;
  value: number;
  icon: LucideIcon;
  tone: string;
}

export function MetricGrid({ metrics }: { metrics: Metric[] }) {
  return (
    <Row xs={2} xl={4} className="g-3 mb-4">
      {metrics.map(({ label, value, icon: Icon, tone }) => (
        <Col key={label}>
          <Card className="overview-metric h-100">
            <Card.Body>
              <span className={`overview-icon overview-tone-${tone}`}>
                <Icon
                  size={27}
                  fill={label === "Projects" ? "currentColor" : "none"}
                />
              </span>
              <div>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
