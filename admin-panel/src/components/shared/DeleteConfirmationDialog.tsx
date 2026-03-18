import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useDarkMode } from "@/hooks/theme/useDarkMode";

interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
}: DeleteConfirmationProps) => {
  const { isDarkMode } = useDarkMode();

  if (!isOpen) return null;

  return (
    <Modal
      show={isOpen}
      onHide={onClose}
      centered
      animation={false}
      backdropClassName='delete-confirmation-backdrop'
      contentClassName={`app-modal-content${isDarkMode ? " text-light" : ""}`}
    >
      <Modal.Header closeButton>
        <Modal.Title id='delete-confirmation-title'>Confirm Deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className='mb-0'>Are you sure you want to delete this item?</p>
      </Modal.Body>
      <Modal.Footer className='justify-content-between'>
        <Button variant='secondary' onClick={onClose}>
          Cancel
        </Button>
        <Button variant='danger' onClick={onConfirm}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmationDialog;
