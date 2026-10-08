import { useState } from "react";
import Button from "@/components/ui/button";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import { TriangleAlert } from "lucide-react";
import { useDarkMode } from "@/providers/theme";

interface ConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: string;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
}

const ConfirmDialog = ({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure you want to continue?",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmVariant = "danger",
  onClose,
  onConfirm,
}: ConfirmDialogProps) => {
  const { isDarkMode } = useDarkMode();
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = async () => {
    if (isConfirming) return;
    setIsConfirming(true);
    try {
      await onConfirm();
    } catch {
      // The action owner reports the contextual error and keeps the dialog open.
    } finally {
      setIsConfirming(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      show={isOpen}
      onHide={() => !isConfirming && onClose()}
      centered
      backdrop={isConfirming ? "static" : true}
      keyboard={!isConfirming}
      backdropClassName="confirm-dialog-backdrop"
      dialogClassName="app-modal-dialog"
      contentClassName={`app-modal-content${isDarkMode ? " text-light" : ""}`}
    >
      <Modal.Header closeButton={!isConfirming}>
        <Modal.Title className="d-flex align-items-center gap-2">
          <span className={`confirm-dialog-icon text-${confirmVariant}`}>
            <TriangleAlert size={20} />
          </span>
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="app-modal-body">
        <p className="mb-0">{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-secondary"
          onClick={onClose}
          disabled={isConfirming}
        >
          {cancelLabel}
        </Button>
        <Button
          variant={confirmVariant}
          onClick={() => void handleConfirm()}
          disabled={isConfirming}
        >
          {isConfirming ? (
            <>
              <Spinner size="sm" aria-hidden="true" /> Working…
            </>
          ) : (
            confirmLabel
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmDialog;
