import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import {
  Brain,
  FileText,
  Folder,
  Image,
  Images,
  Settings,
  UserRound,
} from "lucide-react";
import { PageHeader as Header } from "@/components/layout/page-header";
import { useOverviewQueries } from "./api";
import { MetricGrid, QuickActions, ServiceStatusList } from "./components";
import { clearAccountCaches } from "@/features/account";
import { useOptionalGlobalAlert } from "@/providers/alerts";

const OverviewPage = () => {
  const navigate = useNavigate();
  const { triggerAlert } = useOptionalGlobalAlert();
  const results = useOverviewQueries();

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
    { label: "Projects", value: projects.length, icon: Folder, tone: "blue" },
    { label: "CV entries", value: cvCount, icon: FileText, tone: "green" },
    { label: "Albums", value: albums.length, icon: Image, tone: "purple" },
    { label: "Images", value: imageCount, icon: Images, tone: "gold" },
  ];
  const services = [
    {
      label: "Base service",
      icon: Settings,
      tone: "blue",
      isSuccess: results[8].isSuccess,
      isError: results[8].isError,
    },
    {
      label: "Image service",
      icon: Image,
      tone: "green",
      isSuccess: results[6].isSuccess,
      isError: results[6].isError,
    },
    {
      label: "LLM service",
      icon: Brain,
      tone: "purple",
      isSuccess: results[7].isSuccess,
      isError: results[7].isError,
    },
    {
      label: "Account service",
      icon: UserRound,
      tone: "gold",
      isSuccess: results[8].isSuccess,
      isError: results[8].isError,
    },
  ];

  return (
    <>
      <Header
        className="overview-page-shell"
        text="Overview"
        description="Manage your portfolio, CV and media from one place."
        actions={
          <Button
            className="overview-header-action"
            onClick={() => navigate("/cv-generator")}
          >
            <FileText size={19} /> Generate CV
          </Button>
        }
      />
      <Container fluid="xl" className="page-content overview-page-shell">
        <MetricGrid metrics={metrics} />
        <Row className="g-4">
          <Col lg={6}>
            <QuickActions onNavigate={navigate} />
          </Col>
          <Col lg={6}>
            <ServiceStatusList
              services={services}
              onClearCaches={async () => {
                try {
                  await clearAccountCaches();
                  triggerAlert("Caches cleared successfully", "success");
                } catch {
                  triggerAlert("Failed to clear caches", "danger");
                }
              }}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default OverviewPage;
