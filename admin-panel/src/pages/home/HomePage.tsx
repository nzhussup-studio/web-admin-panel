import Header from "@/components/layout/Header";
import config from "@/config/app-config";
import { navigateExternal } from "@/lib/navigation/external";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/auth/useAuth";

const dashboardSections = [
  {
    title: "Projects",
    description:
      "Manage your projects, update details, and keep public data in sync.",
    path: "/projects",
  },
  {
    title: "CV",
    description:
      "Maintain your experience, education, skills, and certificates in one place.",
    path: "/cv",
  },
  {
    title: `Manage ${config.keycloakRealm} Realm`,
    description:
      "Review accounts, adjust roles, and manage admin access safely.",
    externalUrl: `${config.keycloakUrl}/admin/${config.keycloakRealm}/console`,
  },
  {
    title: "Albums",
    description:
      "Organize albums, update metadata, and curate image collections.",
    path: "/albums",
  },
  {
    title: "CV Generator",
    description:
      "Select structured profile data and export a tailored CV package.",
    path: "/cv-generator",
  },
  {
    title: "LLM Config",
    description:
      "Tune AI-related configuration without touching backend settings directly.",
    path: "/llm",
  },
];

const HomePage = () => {
  const navigate = useNavigate();
  const { state } = useAuth();

  const handleSectionClick = (path?: string, externalUrl?: string) => {
    if (externalUrl) {
      navigateExternal(externalUrl);
      return;
    }

    if (path) {
      navigate(path);
    }
  };

  return (
    <>
      <Header
        text={`Welcome to the Admin Panel, ${state.firstName || "User"}!`}
      />
      <Container className="my-5">
        <Row xs={1} md={2} className="g-4">
          {dashboardSections.map((section) => (
            <Col key={section.path || section.externalUrl}>
              <Card
                className="h-100 rounded-4 app-interactive-card app-navigation-card"
                onClick={() =>
                  handleSectionClick(section.path, section.externalUrl)
                }
              >
                <Card.Body className="d-flex flex-column p-4 app-card-body">
                  <Card.Title className="fw-semibold fs-4 app-card-title">
                    {section.title}
                  </Card.Title>
                  <Card.Text className="text-secondary flex-grow-1">
                    {section.description}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default HomePage;
