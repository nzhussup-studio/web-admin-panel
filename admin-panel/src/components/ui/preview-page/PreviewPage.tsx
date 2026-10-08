import type { ReactNode } from "react";
import Container from "react-bootstrap/Container";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import type { BreadcrumbItem } from "@/components/navigation/breadcrumbs";
import { AsyncState } from "@/components/feedback/error-state";
import Button from "@/components/ui/button";

export interface PreviewField {
  label: string;
  value: ReactNode;
  wide?: boolean;
}
export interface PreviewGroup {
  key: string | number;
  title: string;
  subtitle?: ReactNode;
  fields: PreviewField[];
}

interface PreviewPageProps {
  title: string;
  description?: string;
  breadcrumbs: BreadcrumbItem[];
  groups: PreviewGroup[];
  loading: boolean;
  error: unknown;
  isEmpty: boolean;
  onBack: () => void;
}

export function PreviewPage({
  title,
  description = "Fully rendered record preview.",
  breadcrumbs,
  groups,
  loading,
  error,
  isEmpty,
  onBack,
}: PreviewPageProps) {
  return (
    <>
      <PageHeader
        text={title}
        description={description}
        breadcrumbs={breadcrumbs}
        actions={
          <Button variant="outline-secondary" onClick={onBack}>
            <ArrowLeft size={17} /> Back
          </Button>
        }
      />
      <Container fluid="xl" className="page-content">
        <AsyncState loading={loading} error={error} isEmpty={isEmpty}>
          <div className="preview-page-list">
            {groups.map((group) => (
              <article className="preview-page-content" key={group.key}>
                <header className="preview-page-item-header">
                  <h2>{group.title}</h2>
                  {group.subtitle ? <div>{group.subtitle}</div> : null}
                </header>
                <dl className="preview-page-grid">
                  {group.fields.map((field) => (
                    <div
                      key={field.label}
                      className={
                        field.wide ? "preview-page-field-wide" : undefined
                      }
                    >
                      <dt>{field.label}</dt>
                      <dd>
                        {field.value || (
                          <span className="text-secondary">—</span>
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>
        </AsyncState>
      </Container>
    </>
  );
}
