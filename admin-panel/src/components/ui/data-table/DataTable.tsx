import type { ReactNode } from "react";
import Table from "react-bootstrap/Table";
import { ChevronDown, ChevronUp } from "lucide-react";
import Button from "@/components/ui/button";

export interface DataTableColumn {
  key: string;
  label: ReactNode;
  align?: "start" | "center" | "end";
  width?: string;
  sortable?: boolean;
}

interface DataTableProps {
  columns: DataTableColumn[];
  children: ReactNode;
  sortDirection?: "asc" | "desc";
  onSort?: () => void;
  className?: string;
  mobileSummary?: ReactNode;
}

export function DataTable({
  columns,
  children,
  sortDirection = "desc",
  onSort,
  className = "",
  mobileSummary,
}: DataTableProps) {
  const sortableColumn = columns.find((column) => column.sortable);

  return (
    <div className={`data-table-shell ${className}`.trim()}>
      {sortableColumn && onSort ? (
        <div className="mobile-table-toolbar d-md-none">
          <Button
            variant="outline-secondary"
            onClick={onSort}
            aria-label={`Sort by ${String(sortableColumn.label)} ${sortDirection === "asc" ? "descending" : "ascending"}`}
          >
            <span>Sort: {sortableColumn.label}</span>
            {sortDirection === "asc" ? (
              <ChevronUp size={17} />
            ) : (
              <ChevronDown size={17} />
            )}
          </Button>
          {mobileSummary ? (
            <span className="mobile-table-summary">{mobileSummary}</span>
          ) : null}
        </div>
      ) : null}
      <Table responsive hover className="align-middle mb-0 admin-data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`text-${column.align ?? "start"}`}
                style={column.width ? { width: column.width } : undefined}
              >
                {column.sortable && onSort ? (
                  <Button
                    variant="link"
                    className="data-table-sort"
                    onClick={onSort}
                    aria-label={`Sort by ${String(column.label)} ${sortDirection === "asc" ? "descending" : "ascending"}`}
                  >
                    {column.label}
                    {sortDirection === "asc" ? (
                      <ChevronUp size={15} />
                    ) : (
                      <ChevronDown size={15} />
                    )}
                  </Button>
                ) : (
                  column.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </Table>
    </div>
  );
}
