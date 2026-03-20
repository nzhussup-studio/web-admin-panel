import type { FormEvent, ReactNode } from "react";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import { useDarkMode } from "@/hooks/theme/useDarkMode";

interface PopupProps {
  closePopup: () => void;
  title: ReactNode;
  children?: ReactNode;
  onSubmit: () => Promise<void> | void;
}

const Popup = ({ closePopup, title, children, onSubmit }: PopupProps) => {
  const { isDarkMode } = useDarkMode();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const loadingTimer = setTimeout(() => setIsLoading(true), 100);

    try {
      await onSubmit();
    } finally {
      clearTimeout(loadingTimer);
      setIsLoading(false);
    }
  };

  return (
    <Modal
      show
      onHide={closePopup}
      centered
      scrollable
      animation={false}
      backdropClassName="popup-backdrop"
      contentClassName={`app-modal-content${isDarkMode ? " text-light" : ""}`}
      data-testid="popup-overlay"
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body data-testid="popup-content">{children}</Modal.Body>
        <Modal.Footer className="justify-content-between">
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={closePopup}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Form>
      {isLoading && (
        <div className="text-center my-3">
          <Spinner
            animation="border"
            variant="primary"
            role="status"
            data-testid="loading-spinner"
          >
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}
    </Modal>
  );
};

export default Popup;
