import { CircleAlert, RefreshCw } from "lucide-react";
import Button from "@/components/ui/button";
import { getErrorDetails } from "./errorDetails";

interface ErrorStateProps {
  status?: number;
  message?: string;
}

export function ErrorState({ status = 500, message }: ErrorStateProps) {
  const details = getErrorDetails(status);

  return (
    <section className="error-state">
      <div className="error-state-icon" aria-hidden="true">
        <CircleAlert size={32} />
      </div>
      <div className="error-state-code">Error {status}</div>
      <h2>{details.title}</h2>
      <p>{message || details.description}</p>
      <div className="error-state-actions">
        <Button variant="primary" onClick={() => window.location.reload()}>
          <RefreshCw size={17} /> Try again
        </Button>
      </div>
    </section>
  );
}
