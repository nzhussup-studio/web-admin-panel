import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import { CircleCheck, CircleX, Info, TriangleAlert, X } from "lucide-react";
import Button from "@/components/ui/button";
import { useGlobalAlert } from "@/providers/alerts";
import type { AlertVariant } from "@/providers/alerts/global-alert-context";

interface GlobalAlertProps {
  message?: string;
  show?: boolean;
  onClose?: () => void;
  type?: AlertVariant;
}

const GlobalAlert = ({
  message,
  show,
  onClose,
  type,
}: GlobalAlertProps = {}) => {
  const globalAlert = useGlobalAlert();
  const alert = {
    id: globalAlert.alert.id,
    message: message ?? globalAlert.alert.message,
    show: show ?? globalAlert.alert.show,
    type: type ?? globalAlert.alert.type,
  };
  const closeAlert = onClose ?? globalAlert.closeAlert;

  if (!alert.show) return null;

  const Icon =
    alert.type === "success"
      ? CircleCheck
      : alert.type === "danger"
        ? CircleX
        : alert.type === "warning"
          ? TriangleAlert
          : Info;
  const delay =
    alert.type === "danger" ? 6000 : alert.type === "warning" ? 5000 : 3500;

  return (
    <ToastContainer
      position="bottom-center"
      className="p-3"
      style={{ zIndex: 1090 }}
      aria-live="polite"
    >
      <Toast
        key={alert.id}
        show={alert.show}
        onClose={closeAlert}
        delay={delay}
        autohide
        animation
        className={`app-alert-toast app-alert-${alert.type}`}
        role={alert.type === "danger" ? "alert" : "status"}
      >
        <Toast.Body className="app-alert-toast-body">
          <Icon size={20} aria-hidden="true" />
          <div>{alert.message}</div>
          <Button
            variant="link"
            className="app-alert-close"
            onClick={closeAlert}
            aria-label="Dismiss alert"
          >
            <X size={17} />
          </Button>
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default GlobalAlert;
