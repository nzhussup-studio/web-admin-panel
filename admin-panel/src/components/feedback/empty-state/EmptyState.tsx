interface EmptyStateProps {
  title?: string;
  description?: string;
}

export function EmptyState({
  title = "No information found.",
  description,
}: EmptyStateProps) {
  return (
    <div className="py-5 text-center">
      <h2 className="h3 mb-2">{title}</h2>
      {description ? (
        <p className="text-secondary mb-0">{description}</p>
      ) : null}
    </div>
  );
}
