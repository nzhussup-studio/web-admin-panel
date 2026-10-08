import type { ReactNode } from "react";
import Button from "@/components/ui/button";
import Container from "react-bootstrap/Container";
import Stack from "react-bootstrap/Stack";
import { PageHeader } from "@/components/layout/page-header";
import { AsyncState } from "@/components/feedback/error-state";
import { ArrowDownAZ, Eye } from "lucide-react";
import { Plus } from "lucide-react";
import type { BreadcrumbItem } from "@/components/navigation/breadcrumbs";

interface PageContainerProps {
  className?: string;
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  children: ReactNode;
  isEmpty: boolean;
  loading: boolean;
  error: unknown;
  toggleSort: () => void;
  showSort?: boolean;
  sortLabel?: string;
  onAdd?: () => void;
  showAddButton?: boolean;
  addLabel?: string;
  addInToolbar?: boolean;
  onPreview?: () => void;
  modal?: ReactNode;
  deleteDialog?: ReactNode;
  topContent?: ReactNode;
  afterHeader?: ReactNode;
}

const PageContainer = ({
  className = "",
  title,
  description,
  breadcrumbs,
  children,
  isEmpty,
  loading,
  error,
  toggleSort,
  showSort = true,
  sortLabel = "Sort",
  onAdd,
  showAddButton = false,
  addLabel = "Add new",
  addInToolbar = false,
  onPreview,
  modal,
  deleteDialog,
  topContent,
  afterHeader,
}: PageContainerProps) => {
  return (
    <>
      <PageHeader
        className={className}
        breadcrumbs={breadcrumbs}
        text={title}
        description={description ?? `Manage ${title.toLowerCase()} records.`}
        actions={
          onPreview || (showAddButton && onAdd && !addInToolbar) ? (
            <div className="d-flex gap-2">
              {onPreview ? (
                <Button variant="outline-primary" onClick={onPreview}>
                  <Eye size={18} /> Preview
                </Button>
              ) : null}
              {showAddButton && onAdd && !addInToolbar ? (
                <Button variant="primary" onClick={onAdd}>
                  <Plus size={18} /> {addLabel}
                </Button>
              ) : null}
            </div>
          ) : null
        }
      />
      {afterHeader}
      <Container fluid="xl" className={`page-content ${className}`.trim()}>
        {topContent || showSort || (showAddButton && addInToolbar) ? (
          <Stack
            direction="horizontal"
            gap={3}
            className="align-items-center justify-content-between flex-wrap mb-4"
          >
            {topContent ? (
              <div className="crud-toolbar-start">{topContent}</div>
            ) : (
              <span />
            )}
            <div className="d-flex align-items-center gap-2 flex-wrap crud-toolbar">
              {showSort ? (
                <Button
                  variant="outline-secondary"
                  className="d-inline-flex align-items-center gap-2"
                  onClick={toggleSort}
                >
                  <ArrowDownAZ size={16} />
                  {sortLabel}
                </Button>
              ) : null}
              {showAddButton && onAdd && addInToolbar ? (
                <Button variant="primary" onClick={onAdd}>
                  <Plus size={18} /> {addLabel}
                </Button>
              ) : null}
            </div>
          </Stack>
        ) : null}
        <AsyncState isEmpty={isEmpty} loading={loading} error={error}>
          {children}
        </AsyncState>
      </Container>
      {deleteDialog}
      {modal}
    </>
  );
};

export default PageContainer;
