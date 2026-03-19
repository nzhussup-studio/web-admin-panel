import CloseButton from "react-bootstrap/CloseButton";
import Stack from "react-bootstrap/Stack";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import { useGlobalAlert } from "@/hooks/alerts/useGlobalAlert";
import type { AlertVariant } from "@/types/common";

interface GlobalAlertProps {
  message?: string;
  show?: boolean;
  onClose?: () => void;
  type?: AlertVariant;
}

const GlobalAlert = ({ message, show, onClose, type }: GlobalAlertProps = {}) => {
  const globalAlert = useGlobalAlert();
  const alert = {
    message: message ?? globalAlert.alert.message,
    show: show ?? globalAlert.alert.show,
    type: type ?? globalAlert.alert.type,
  };
  const closeAlert = onClose ?? globalAlert.closeAlert;

  if (!alert.show) return null;

  return (
    <ToastContainer position='bottom-center' className='p-3' style={{ zIndex: 1080 }}>
      <Toast
        show={alert.show}
        onClose={closeAlert}
        delay={3000}
        autohide
        animation
        className={`border-0 shadow app-alert-toast text-bg-${alert.type}`}
        role='alert'
      >
        <Toast.Body className='app-alert-toast-body'>
          <Stack direction='horizontal' gap={3} className='align-items-start'>
            <div className='flex-grow-1'>{alert.message}</div>
            <CloseButton
              variant={alert.type === "warning" ? undefined : "white"}
              onClick={closeAlert}
              aria-label='Dismiss alert'
            />
          </Stack>
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default GlobalAlert;
