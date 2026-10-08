import { useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import {
  ArrowRight,
  Award,
  BriefcaseBusiness,
  GraduationCap,
  Wrench,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";

const sections = [
  {
    title: "Work experience",
    description: "Roles, descriptions, technology stacks and display order.",
    path: "/cv/work-experience",
    icon: BriefcaseBusiness,
  },
  {
    title: "Education",
    description: "Institutions, degrees, dates and supporting details.",
    path: "/cv/education",
    icon: GraduationCap,
  },
  {
    title: "Skills",
    description: "Backend-defined skill groups and their display order.",
    path: "/cv/skills",
    icon: Wrench,
  },
  {
    title: "Certifications",
    description: "Certificates, issuers and external references.",
    path: "/cv/certifications",
    icon: Award,
  },
] as const;

const CvPage = () => {
  const navigate = useNavigate();
  return (
    <>
      <PageHeader
        text="CV"
        description="Manage the structured content used by your portfolio and CV generator."
      />
      <Container fluid="xl" className="page-content">
        <Card>
          <ListGroup variant="flush" className="section-index">
            {sections.map(({ title, description, path, icon: Icon }) => (
              <ListGroup.Item action key={path} onClick={() => navigate(path)}>
                <span className="overview-list-icon">
                  <Icon size={19} />
                </span>
                <span className="flex-grow-1">
                  <strong>{title}</strong>
                  <small>{description}</small>
                </span>
                <ArrowRight size={18} />
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card>
      </Container>
    </>
  );
};

export default CvPage;
