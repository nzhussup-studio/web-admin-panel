import type {
  CSSProperties,
  FormEvent,
  KeyboardEvent,
  PointerEvent,
  ReactNode,
} from "react";
import { useRef, useState } from "react";
import Button from "@/components/ui/button";
import Form from "react-bootstrap/Form";
import Offcanvas from "react-bootstrap/Offcanvas";
import Spinner from "react-bootstrap/Spinner";
import { useDarkMode } from "@/providers/theme";

interface FormDrawerProps {
  closePopup: () => void;
  title: ReactNode;
  children?: ReactNode;
  onSubmit: () => Promise<void> | void;
}

const DRAWER_WIDTH_KEY = "admin-form-drawer-width";
const DEFAULT_DRAWER_WIDTH = 416;
const MIN_DRAWER_WIDTH = 320;

const clampDrawerWidth = (width: number) =>
  Math.min(
    Math.max(width, MIN_DRAWER_WIDTH),
    Math.min(960, window.innerWidth - 32),
  );

const FormDrawer = ({
  closePopup,
  title,
  children,
  onSubmit,
}: FormDrawerProps) => {
  const { isDarkMode } = useDarkMode();
  const [isLoading, setIsLoading] = useState(false);
  const [drawerWidth, setDrawerWidth] = useState(() => {
    const savedWidth = Number(window.localStorage.getItem(DRAWER_WIDTH_KEY));
    return clampDrawerWidth(savedWidth || DEFAULT_DRAWER_WIDTH);
  });
  const isSubmittingRef = useRef(false);
  const resizeStartRef = useRef<{ x: number; width: number } | null>(null);

  const saveDrawerWidth = (width: number) => {
    window.localStorage.setItem(DRAWER_WIDTH_KEY, String(width));
  };

  const startResize = (event: PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    resizeStartRef.current = { x: event.clientX, width: drawerWidth };
  };

  const resize = (event: PointerEvent<HTMLDivElement>) => {
    if (!resizeStartRef.current) return;
    const nextWidth = clampDrawerWidth(
      resizeStartRef.current.width + resizeStartRef.current.x - event.clientX,
    );
    setDrawerWidth(nextWidth);
  };

  const stopResize = (event: PointerEvent<HTMLDivElement>) => {
    if (!resizeStartRef.current) return;
    event.currentTarget.releasePointerCapture(event.pointerId);
    resizeStartRef.current = null;
    saveDrawerWidth(drawerWidth);
  };

  const resizeWithKeyboard = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const nextWidth = clampDrawerWidth(
      drawerWidth + (event.key === "ArrowLeft" ? 32 : -32),
    );
    setDrawerWidth(nextWidth);
    saveDrawerWidth(nextWidth);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    setIsLoading(true);

    try {
      await onSubmit();
    } catch {
      // The feature mutation reports its contextual error and keeps the drawer open.
    } finally {
      isSubmittingRef.current = false;
      setIsLoading(false);
    }
  };

  return (
    <Offcanvas
      show
      onHide={() => !isLoading && closePopup()}
      placement="end"
      backdrop={isLoading ? "static" : true}
      keyboard={!isLoading}
      className={`form-drawer${isDarkMode ? " text-light" : ""}`}
      style={{ "--form-drawer-width": `${drawerWidth}px` } as CSSProperties}
      data-testid="popup-overlay"
    >
      <div
        className="form-drawer-resize-handle"
        role="separator"
        aria-label="Resize editor"
        aria-orientation="vertical"
        aria-valuemin={MIN_DRAWER_WIDTH}
        aria-valuemax={Math.min(960, window.innerWidth - 32)}
        aria-valuenow={drawerWidth}
        tabIndex={0}
        title="Drag to resize"
        onPointerDown={startResize}
        onPointerMove={resize}
        onPointerUp={stopResize}
        onPointerCancel={stopResize}
        onDoubleClick={() => {
          setDrawerWidth(DEFAULT_DRAWER_WIDTH);
          saveDrawerWidth(DEFAULT_DRAWER_WIDTH);
        }}
        onKeyDown={resizeWithKeyboard}
      />
      <Offcanvas.Header closeButton={!isLoading}>
        <Offcanvas.Title>{title}</Offcanvas.Title>
      </Offcanvas.Header>
      <Form onSubmit={handleSubmit} className="form-drawer-form">
        <Offcanvas.Body
          className="form-drawer-body"
          data-testid="popup-content"
        >
          {children}
        </Offcanvas.Body>
        <div className="form-drawer-footer">
          <Button
            type="button"
            variant="outline-secondary"
            onClick={closePopup}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save changes"}
          </Button>
        </div>
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
    </Offcanvas>
  );
};

export default FormDrawer;
