import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "@/components/ui/button";
import { RefreshCw, type LucideIcon } from "lucide-react";

interface ServiceStatus {
  label: string;
  icon: LucideIcon;
  tone: string;
  isSuccess: boolean;
  isError: boolean;
}

export function ServiceStatusList({
  services,
  onClearCaches,
}: {
  services: ServiceStatus[];
  onClearCaches: () => void;
}) {
  return (
    <Card className="h-100 overview-panel">
      <Card.Header>
        <h2>Services</h2>
        <Button variant="outline-secondary" size="sm" onClick={onClearCaches}>
          <RefreshCw size={16} /> Clear caches
        </Button>
      </Card.Header>
      <ListGroup variant="flush">
        {services.map(({ label, icon: Icon, tone, isSuccess, isError }) => (
          <ListGroup.Item key={label}>
            <span className={`overview-list-icon overview-tone-${tone}`}>
              <Icon size={24} />
            </span>
            <span>{label}</span>
            <span
              className={`badge ${isSuccess ? "text-bg-success-subtle text-success" : isError ? "text-bg-danger-subtle text-danger" : "text-bg-secondary-subtle"}`}
            >
              {isSuccess ? "Operational" : isError ? "Unavailable" : "Checking"}
            </span>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  );
}
