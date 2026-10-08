import Container from "react-bootstrap/Container";
import { PageHeader } from "@/components/layout/page-header";
import { ErrorState } from "./ErrorState";
import { getErrorDetails } from "./errorDetails";

export function ErrorPage({
  status,
  message,
}: {
  status: number;
  message?: string;
}) {
  const details = getErrorDetails(status);

  return (
    <>
      <PageHeader
        text={details.title}
        breadcrumbs={[
          { label: "Overview", to: "/" },
          { label: `Error ${status}` },
        ]}
      />
      <Container fluid="xl" className="page-content">
        <ErrorState status={status} message={message} />
      </Container>
    </>
  );
}

export const InternalServerErrorPage = () => <ErrorPage status={500} />;
export const BadGatewayPage = () => <ErrorPage status={502} />;
export const ServiceUnavailablePage = () => <ErrorPage status={503} />;
export const GatewayTimeoutPage = () => <ErrorPage status={504} />;
