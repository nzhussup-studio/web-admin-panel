import type { ReactNode } from "react";
import Container from "react-bootstrap/Container";
import {
  Breadcrumbs,
  type BreadcrumbItem,
} from "@/components/navigation/breadcrumbs";

type PageHeaderProps = {
  className?: string;
  text?: string;
  description?: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  titleContent?: ReactNode;
  actions?: ReactNode;
};

const PageHeader = ({
  className = "",
  text,
  description,
  breadcrumbs,
  titleContent,
  actions,
}: PageHeaderProps) => {
  const resolvedBreadcrumbs =
    breadcrumbs ??
    (text
      ? text === "Overview"
        ? [{ label: "Overview" }]
        : [{ label: "Overview", to: "/" }, { label: text }]
      : [{ label: "Overview", to: "/" }]);

  return (
    <Container fluid="xl" className={`page-header ${className}`.trim()}>
      <Breadcrumbs items={resolvedBreadcrumbs} />
      <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap">
        <div>
          {titleContent ?? <h1>{text}</h1>}
          {description ? <p>{description}</p> : null}
        </div>
        {actions ? <div className="page-header-actions">{actions}</div> : null}
      </div>
    </Container>
  );
};

export default PageHeader;
