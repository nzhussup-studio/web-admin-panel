import ProgressBar from "react-bootstrap/ProgressBar";
import { CloudUpload } from "lucide-react";

interface UploadProgressProps {
  completed: number;
  total: number;
  status: string;
}

export function UploadProgress({
  completed,
  total,
  status,
}: UploadProgressProps) {
  const progress = total > 0 ? (completed / total) * 100 : 0;
  return (
    <div className="upload-progress mb-4" role="status">
      <CloudUpload size={30} />
      <div className="flex-grow-1">
        <div className="d-flex justify-content-between mb-2">
          <strong>
            {status === "completed"
              ? "Images uploaded"
              : `Uploading ${total} images`}
          </strong>
          <span>
            {completed} of {total} complete
          </span>
        </div>
        <div className="d-flex align-items-center gap-3">
          <ProgressBar
            className="flex-grow-1"
            now={progress}
            animated={status === "queued" || status === "processing"}
          />
          <span>{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
}
