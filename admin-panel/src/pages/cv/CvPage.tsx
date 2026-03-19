import React from "react";
import Header from "@/components/layout/Header";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { useNavigate } from "react-router-dom";
import { BackCircleIcon } from "@/assets/icons";

const cvSections = [
  {
    title: "Work Experience",
    description:
      "Manage professional roles, descriptions, tech stacks, and ordering.",
    path: "/cv/work-experience",
  },
  {
    title: "Education",
    description:
      "Maintain institutions, degrees, dates, and supporting metadata.",
    path: "/cv/education",
  },
  {
    title: "Skills",
    description:
      "Group and order your skill sets for export and display.",
    path: "/cv/skills",
  },
  {
    title: "Certifications",
    description:
      "Keep certificates and external references current and easy to export.",
    path: "/cv/certifications",
  },
];

const CvPage = () => {
  const navigate = useNavigate();
  return (
    <>
      <Header text={"CV Management"} />
      <Container className='my-5'>
        <Button
          variant='outline-secondary'
          className='d-inline-flex align-items-center gap-2 mb-4'
          onClick={() => navigate(-1)}
        >
          <BackCircleIcon width={16} height={16} />
          Back
        </Button>
        <Row xs={1} md={2} className='g-4'>
          {cvSections.map((section) => (
            <Col key={section.path}>
              <Card
                className='h-100 rounded-4 app-interactive-card app-navigation-card'
                onClick={() => navigate(section.path)}
              >
                <Card.Body className='d-flex flex-column p-4 app-card-body'>
                  <Card.Title className='fw-semibold app-card-title'>{section.title}</Card.Title>
                  <Card.Text className='text-secondary flex-grow-1'>
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

export default CvPage;
