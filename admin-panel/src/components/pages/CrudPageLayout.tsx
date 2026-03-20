import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Container from "react-bootstrap/Container";
import Stack from "react-bootstrap/Stack";
import Header from "@/components/layout/Header";
import PageState from "@/components/pages/PageState";
import { BackCircleIcon, FunnelIcon } from "@/assets/icons";

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
  const navigate = useNavigate();

  return (
    <>
      <Header text={title} />
      {afterHeader}
      <Container className="my-5">
        <Stack
          direction="horizontal"
          gap={3}
          className="align-items-center justify-content-between flex-wrap mb-4"
        >
          <Button
            variant="outline-secondary"
            className="d-inline-flex align-items-center gap-2"
            onClick={() => navigate(-1)}
          >
            <BackCircleIcon width={16} height={16} />
            Back
          </Button>
          <div className="d-flex align-items-center gap-2 flex-wrap ms-auto">
            {topContent}
            <ButtonGroup>
              <Button
                variant="outline-primary"
                className="d-inline-flex align-items-center gap-2"
                onClick={toggleSort}
              >
                <FunnelIcon width={16} height={16} />
                Sort
              </Button>
              {showAddButton && onAdd ? (
                <Button variant="primary" onClick={onAdd}>
                  Add New
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
