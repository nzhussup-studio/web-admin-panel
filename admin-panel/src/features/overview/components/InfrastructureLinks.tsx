import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Activity, ExternalLink, GitMerge } from "lucide-react";

const links = [
  {
    title: "Argo CD",
    description: "Continuous delivery and application deployments",
    hostname: "argocd.nzhussup.dev",
    href: "https://argocd.nzhussup.dev",
    icon: GitMerge,
    tone: "argo",
  },
  {
    title: "Monitoring",
    description: "Infrastructure metrics, dashboards and observability",
    hostname: "monitoring.nzhussup.dev",
    href: "https://monitoring.nzhussup.dev",
    icon: Activity,
    tone: "monitoring",
  },
] as const;

export function InfrastructureLinks() {
  return (
    <section
      className="overview-infrastructure"
      aria-labelledby="infrastructure-title"
    >
      <h2 id="infrastructure-title">Infrastructure</h2>
      <Row className="g-3">
        {links.map(
          ({ title, description, hostname, href, icon: Icon, tone }) => (
            <Col key={href} md={6}>
              <Card
                as="a"
                href={href}
                target="_blank"
                rel="noreferrer"
                className="overview-infrastructure-card h-100"
              >
                <Card.Body>
                  <span
                    className={`infrastructure-logo infrastructure-logo-${tone}`}
                  >
                    <Icon size={27} />
                  </span>
                  <span className="infrastructure-content">
                    <strong>{title}</strong>
                    <span>{description}</span>
                    <small>{hostname}</small>
                  </span>
                  <ExternalLink className="infrastructure-external" size={19} />
                </Card.Body>
              </Card>
            </Col>
          ),
        )}
      </Row>
    </section>
  );
}
