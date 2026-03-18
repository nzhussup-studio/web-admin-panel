import Header from "@/components/layout/Header";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { useNavigate } from "react-router-dom";

const dashboardSections = [
  {
    title: "Projects",
    description:
      "Manage your projects, update details, and keep public data in sync.",
    buttonLabel: "Manage Projects",
    path: "/projects",
  },
  {
    title: "CV",
    description:
      "Maintain your experience, education, skills, and certificates in one place.",
    buttonLabel: "Manage CV",
    path: "/cv",
  },
  {
    title: "Users",
    description:
      "Review accounts, adjust roles, and manage admin access safely.",
    buttonLabel: "Manage Users",
    path: "/users",
  },
  {
    title: "Albums",
    description:
      "Organize albums, update metadata, and curate image collections.",
    buttonLabel: "Manage Albums",
    path: "/albums",
  },
  {
    title: "CV Generator",
    description:
      "Select structured profile data and export a tailored CV package.",
    buttonLabel: "Generate CV",
    path: "/cv-generator",
  },
  {
    title: "LLM Config",
    description:
      "Tune AI-related configuration without touching backend settings directly.",
    buttonLabel: "Configure LLM",
    path: "/llm",
  },
];

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header text={"Welcome to the Admin Panel"} />
      <Container className='my-5'>
        <Row xs={1} md={2} className='g-4'>
          {dashboardSections.map((section) => (
            <Col key={section.path}>
              <Card
                className='h-100 rounded-4 app-interactive-card app-navigation-card'
                onClick={() => navigate(section.path)}
              >
                <Card.Body className='d-flex flex-column p-4 app-card-body'>
                  <Card.Title className='fw-semibold fs-4 app-card-title'>
                    {section.title}
                  </Card.Title>
                  <Card.Text className='text-secondary flex-grow-1'>
                    {section.description}
                  </Card.Text>
                  <div className='app-card-actions'>
                    <Button onClick={() => navigate(section.path)}>
                      {section.buttonLabel}
                    </Button>
                  </div>
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
