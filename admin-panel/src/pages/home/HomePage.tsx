import { useQueries } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import {
  ArrowRight,
  BookOpen,
  FileUser,
  FolderKanban,
  Image,
  Images,
} from "lucide-react";
import { queryKeys } from "@/api";
import Header from "@/components/layout/Header";
import {
  AlbumService,
  CertificateControllerService,
  EducationControllerService,
  HealthService,
  ProjectControllerService,
  SkillControllerService,
  WorkExperienceControllerService,
} from "@/lib/api/client";

const quickActions = [
  { label: "Add project", path: "/projects", icon: FolderKanban },
  { label: "Add work experience", path: "/cv/work-experience", icon: FileUser },
  { label: "Create album", path: "/albums", icon: Image },
  { label: "Generate CV", path: "/cv-generator", icon: BookOpen },
] as const;

const HomePage = () => {
  const navigate = useNavigate();
  const results = useQueries({
    queries: [
      {
        queryKey: queryKeys.projects,
        queryFn: () => ProjectControllerService.listProject(),
      },
      {
        queryKey: queryKeys.cv.workExperience,
        queryFn: () => WorkExperienceControllerService.listWorkExperience(),
      },
      {
        queryKey: queryKeys.cv.education,
        queryFn: () => EducationControllerService.listEducation(),
      },
      {
        queryKey: queryKeys.cv.skills,
        queryFn: () => SkillControllerService.listSkill(),
      },
      {
        queryKey: queryKeys.cv.certifications,
        queryFn: () => CertificateControllerService.listCertificate(),
      },
      {
        queryKey: queryKeys.albums.list("all"),
        queryFn: async () => (await AlbumService.getV1Album("all")).data ?? [],
      },
      {
        queryKey: ["health", "images"],
        queryFn: () => HealthService.getV1AlbumHealth(),
      },
      {
        queryKey: ["health", "llm"],
        queryFn: () => HealthService.getV1LlmHealth(),
      },
      {
        queryKey: ["health", "account"],
        queryFn: () => HealthService.getHealth(),
      },
    ],
  });

  const projects = results[0].data ?? [];
  const cvCount = [1, 2, 3, 4].reduce(
    (total, index) =>
      total + ((results[index].data as unknown[] | undefined)?.length ?? 0),
    0,
  );
  const albums = (results[5].data ?? []) as Array<{ image_count?: number }>;
  const imageCount = albums.reduce(
    (total, album) => total + (album.image_count ?? 0),
    0,
  );
  const metrics = [
    { label: "Projects", value: projects.length, icon: FolderKanban },
    { label: "CV entries", value: cvCount, icon: FileUser },
    { label: "Albums", value: albums.length, icon: Image },
    { label: "Images", value: imageCount, icon: Images },
  ];
  const services = [
    { label: "Image service", query: results[6] },
    { label: "LLM service", query: results[7] },
    { label: "Account service", query: results[8] },
  ];

  return (
    <>
      <Header
        text="Overview"
        description="Manage your portfolio, CV and media from one place."
        actions={
          <Button onClick={() => navigate("/cv-generator")}>
            <BookOpen size={17} /> Generate CV
          </Button>
        }
      />
      <Container fluid="xl" className="page-content">
        <Row xs={2} xl={4} className="g-3 mb-4">
          {metrics.map(({ label, value, icon: Icon }) => (
            <Col key={label}>
              <Card className="overview-metric h-100">
                <Card.Body>
                  <span className="overview-icon">
                    <Icon size={21} />
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
        <Row className="g-4">
          <Col lg={7}>
            <Card className="h-100">
              <Card.Header>
                <h2>Quick actions</h2>
              </Card.Header>
              <ListGroup variant="flush">
                {quickActions.map(({ label, path, icon: Icon }) => (
                  <ListGroup.Item
                    action
                    key={path}
                    onClick={() => navigate(path)}
                  >
                    <span className="overview-list-icon">
                      <Icon size={18} />
                    </span>
                    <span>{label}</span>
                    <ArrowRight size={17} className="ms-auto" />
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
          </Col>
          <Col lg={5}>
            <Card className="h-100">
              <Card.Header>
                <h2>Services</h2>
              </Card.Header>
              <ListGroup variant="flush">
                {services.map(({ label, query }) => (
                  <ListGroup.Item key={label}>
                    <span>{label}</span>
                    <span
                      className={`badge ${query.isSuccess ? "text-bg-success-subtle text-success" : query.isError ? "text-bg-danger-subtle text-danger" : "text-bg-secondary-subtle"}`}
                    >
                      {query.isSuccess
                        ? "Operational"
                        : query.isError
                          ? "Unavailable"
                          : "Checking"}
                    </span>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default HomePage;
