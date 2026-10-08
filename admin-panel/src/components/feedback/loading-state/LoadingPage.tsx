import Container from "react-bootstrap/Container";
import { PageHeader } from "@/components/layout/page-header";
import LoadingState from "./LoadingState";

export function LoadingPage() {
  return (
    <>
      <PageHeader
        text="Loading"
        breadcrumbs={[{ label: "Overview", to: "/" }, { label: "Loading" }]}
      />
      <Container fluid="xl" className="page-content">
        <LoadingState
          title="Preparing your admin panel"
          message="Checking your session and loading the requested page."
          fullPage
        />
      </Container>
    </>
  );
}
