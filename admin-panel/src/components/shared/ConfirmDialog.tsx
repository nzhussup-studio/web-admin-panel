import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useDarkMode } from "@/hooks/theme/useDarkMode";

interface ConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: string;
  onClose: () => void;
  onConfirm: () => void;
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

  if (!isOpen) return null;

  return (
    <Modal
      show={isOpen}
      onHide={onClose}
      centered
      animation={false}
      backdropClassName='confirm-dialog-backdrop'
      contentClassName={`app-modal-content${isDarkMode ? " text-light" : ""}`}
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className='mb-0'>{message}</p>
      </Modal.Body>
      <Modal.Footer className='justify-content-between'>
        <Button variant='secondary' onClick={onClose}>
          {cancelLabel}
        </Button>
        <Button variant={confirmVariant} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmDialog;
