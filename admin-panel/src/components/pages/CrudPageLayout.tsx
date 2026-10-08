import type { ReactNode } from "react";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Container from "react-bootstrap/Container";
import Stack from "react-bootstrap/Stack";
import Header from "@/components/layout/Header";
import PageState from "@/components/pages/PageState";
import { ArrowDownAZ, Plus } from "lucide-react";
import { CvSectionNav } from "@/components/navigation/cv-section-nav";

interface CrudPageLayoutProps {
  title: string;
  children: ReactNode;
  isEmpty: boolean;
  loading: boolean;
  error: unknown;
  toggleSort: () => void;
  onAdd?: () => void;
  showAddButton?: boolean;
  modal?: ReactNode;
  deleteDialog?: ReactNode;
  topContent?: ReactNode;
  afterHeader?: ReactNode;
}

const CrudPageLayout = ({
  title,
  children,
  isEmpty,
  loading,
  error,
  toggleSort,
  onAdd,
  showAddButton = false,
  modal,
  deleteDialog,
  topContent,
  afterHeader,
}: CrudPageLayoutProps) => {
  return (
    <>
      <Header
        text={title}
        description={`Manage ${title.toLowerCase()} records.`}
      />
      {["Work Experience", "Education", "Skills", "Certifications"].includes(
        title,
      ) ? (
        <Container fluid="xl">
          <CvSectionNav />
        </Container>
      ) : null}
      {afterHeader}
      <Container fluid="xl" className="page-content">
        <Stack
          direction="horizontal"
          gap={3}
          className="align-items-center justify-content-between flex-wrap mb-4"
        >
          <div className="d-flex align-items-center gap-2 flex-wrap ms-auto w-100 justify-content-end crud-toolbar">
            {topContent}
            <ButtonGroup>
              <Button
                variant="outline-primary"
                className="d-inline-flex align-items-center gap-2"
                onClick={toggleSort}
              >
                <ArrowDownAZ size={16} />
                Sort
              </Button>
              {showAddButton && onAdd ? (
                <Button
                  variant="primary"
                  onClick={onAdd}
                  className="d-inline-flex align-items-center gap-2"
                >
                  <Plus size={16} /> Add new
                </Button>
              ) : null}
            </ButtonGroup>
          </div>
        </Stack>
        <PageState isEmpty={isEmpty} loading={loading} error={error}>
          {children}
        </PageState>
      </Container>
      {deleteDialog}
      {modal}
    </>
  );
};

export default CrudPageLayout;
