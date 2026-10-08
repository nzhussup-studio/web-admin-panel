import type { ReactNode } from "react";

export interface MobileCardMetadata {
  label: string;
  value: ReactNode;
}

interface DataTableMobileCardProps {
  colSpan: number;
  title: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
  metadata?: MobileCardMetadata[];
  actions?: ReactNode;
}

export function DataTableMobileCard({
  colSpan,
  title,
  subtitle,
  children,
  metadata = [],
  actions,
}: DataTableMobileCardProps) {
  return (
    <td className="mobile-data-cell d-md-none" colSpan={colSpan}>
      <article className="mobile-data-card">
        <header className="mobile-data-card-header">
          <div className="mobile-data-card-heading">
            <div className="mobile-data-card-title">{title}</div>
            {subtitle ? (
              <div className="mobile-data-card-subtitle">{subtitle}</div>
            ) : null}
          </div>
          {actions ? (
            <div
              className="mobile-data-card-actions"
              onClick={(event) => event.stopPropagation()}
            >
              {actions}
            </div>
          ) : null}
        </header>
        {children ? (
          <div className="mobile-data-card-body">{children}</div>
        ) : null}
        {metadata.length > 0 ? (
          <dl className="mobile-data-card-meta">
            {metadata.map(({ label, value }) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value || "—"}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </article>
    </td>
  );
}
