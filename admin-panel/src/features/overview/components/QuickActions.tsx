import { ArrowRight, FileText, Folder, Image } from "lucide-react";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

const actions = [
  { label: "Add project", path: "/projects", icon: Folder, tone: "blue" },
  {
    label: "Add work experience",
    path: "/cv/work-experience",
    icon: FileText,
    tone: "green",
  },
  { label: "Create album", path: "/albums", icon: Image, tone: "purple" },
  {
    label: "Generate CV",
    path: "/cv-generator",
    icon: FileText,
    tone: "gold",
  },
] as const;

export function QuickActions({
  onNavigate,
}: {
  onNavigate: (path: string) => void;
}) {
  return (
    <Card className="h-100 overview-panel">
      <Card.Header>
        <h2>Quick actions</h2>
      </Card.Header>
      <ListGroup variant="flush">
        {actions.map(({ label, path, icon: Icon, tone }) => (
          <ListGroup.Item action key={path} onClick={() => onNavigate(path)}>
            <span className={`overview-list-icon overview-tone-${tone}`}>
              <Icon
                size={24}
                fill={label === "Add project" ? "currentColor" : "none"}
              />
            </span>
            <span>{label}</span>
            <ArrowRight size={20} className="ms-auto" />
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  );
}
