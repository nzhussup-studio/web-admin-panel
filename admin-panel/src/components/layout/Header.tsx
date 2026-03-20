import { useState, type MouseEvent, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Row from "react-bootstrap/Row";
import config from "@/config/app-config";
import { useAuth } from "@/hooks/auth/useAuth";
import { useDarkMode } from "@/hooks/theme/useDarkMode";
import { AccountService, CacheService } from "@/lib/api/client";
import { useOptionalGlobalAlert } from "@/hooks/alerts/useOptionalGlobalAlert";
import { getApiErrorMessage } from "@/lib/api/errors";
import {
  CodeSlashIcon,
  DatabaseZapIcon,
  LogoutIcon,
  TrashIcon,
} from "@/assets/icons";
import { navigateExternal } from "@/lib/navigation/external";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import ThemeToggle from "@/components/shared/ThemeToggle";
import type { AuthState } from "@/types/common";

interface ConfirmDialogState {
  title: string;
  message: string;
  confirmLabel: string;
  confirmVariant?: string;
  onConfirm: () => void | Promise<void>;
}

interface HeaderProps {
  text?: string;
  showClearCacheButton?: boolean;
  titleContent?: ReactNode;
  allowUnauthenticatedLogin?: boolean;
}

const Header = ({
  text,
  showClearCacheButton = true,
  titleContent,
  allowUnauthenticatedLogin = false,
}: HeaderProps) => {
  const { state, login, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const { triggerAlert } = useOptionalGlobalAlert();
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState | null>(
    null,
  );

  const extractInitialsFromState = (authState: AuthState) => {
    const { firstName, lastName } = authState;
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`;
    }
    return "N/A";
  };

  const handleAuthAction = () => {
    if (!state.isAuthenticated) {
      void login();
      return;
    }

    setConfirmDialog({
      title: "Logout",
      message: "Are you sure you want to logout?",
      confirmLabel: "Logout",
      onConfirm: () => logout(),
    });
  };

  const handleLogoClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate("/");
  };

  const handleProfileClick = () => {
    navigateExternal(
      `${config.keycloakUrl}/realms/${config.keycloakRealm}/account`,
    );
  };

  const onClearCache = async () => {
    try {
      await CacheService.deleteV1AlbumCache();
      triggerAlert("Cache cleared successfully", "success");
    } catch (error) {
      triggerAlert(
        getApiErrorMessage(error, "Failed to clear cache"),
        "danger",
      );
    }
  };

  const onDeleteAccount = async () => {
    try {
      await AccountService.deleteV1Account();
      await logout(window.location.origin);
    } catch (error) {
      triggerAlert(
        getApiErrorMessage(error, "Failed to delete account"),
        "danger",
      );
    }
  };

  return (
    <Navbar bg="body" expand="md" className="py-3 mb-4 app-header-shell">
      <Container>
        <Row className="w-100 align-items-center gy-3">
          <Col
            xs={12}
            md={4}
            className="d-flex justify-content-center justify-content-md-start"
          >
            <Navbar.Brand
              href="/"
              className="d-inline-flex align-items-center mb-0"
              onClick={handleLogoClick}
            >
              <span className="visually-hidden">Home</span>
              <CodeSlashIcon width={40} height={40} />
            </Navbar.Brand>
          </Col>

          <Col xs={12} md={4} className="text-center">
            {titleContent ? (
              <div className="d-flex justify-content-center text-body">
                {titleContent}
              </div>
            ) : (
              <Navbar.Text className="fw-semibold fs-4 text-body m-0 d-block">
                {text}
              </Navbar.Text>
            )}
          </Col>

          <Col xs={12} md={4}>
            <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-end gap-2">
              {showClearCacheButton && (
                <Button
                  type="button"
                  variant="link"
                  className="app-icon-action app-icon-action-danger"
                  onClick={() =>
                    setConfirmDialog({
                      title: "Clear Cache",
                      message: "Are you sure you want to clear cache?",
                      confirmLabel: "Clear Cache",
                      confirmVariant: "danger",
                      onConfirm: onClearCache,
                    })
                  }
                  data-testid="clear-cache-button"
                  aria-label="Clear cache"
                >
                  <DatabaseZapIcon width={25} height={25} />
                </Button>
              )}
              <ThemeToggle isDarkMode={isDarkMode} onToggle={toggleDarkMode} />
              {state.isAuthenticated ? (
                <Button
                  type="button"
                  variant="link"
                  className="app-profile-action"
                  onClick={handleProfileClick}
                  aria-label="Profile"
                >
                  {extractInitialsFromState(state)}
                </Button>
              ) : null}
              {state.isAuthenticated ? (
                <Button
                  type="button"
                  variant="link"
                  className="app-icon-action app-icon-action-danger"
                  onClick={() =>
                    setConfirmDialog({
                      title: "Delete Account",
                      message:
                        "Are you sure you want to permanently delete your account? This action cannot be undone.",
                      confirmLabel: "Delete Account",
                      confirmVariant: "danger",
                      onConfirm: onDeleteAccount,
                    })
                  }
                  aria-label="Delete account"
                >
                  <TrashIcon width={22} height={22} />
                </Button>
              ) : null}
              {state.isAuthenticated || allowUnauthenticatedLogin ? (
                <Button
                  type="button"
                  variant={state.isAuthenticated ? "link" : "outline-primary"}
                  className={
                    state.isAuthenticated ? "app-icon-action" : undefined
                  }
                  onClick={handleAuthAction}
                  aria-label={state.isAuthenticated ? "Logout" : "Login"}
                >
                  {state.isAuthenticated ? (
                    <LogoutIcon width={25} height={25} />
                  ) : (
                    "Login"
                  )}
                </Button>
              ) : null}
            </div>
          </Col>
        </Row>
      </Container>
      <ConfirmDialog
        isOpen={!!confirmDialog}
        title={confirmDialog?.title}
        message={confirmDialog?.message}
        confirmLabel={confirmDialog?.confirmLabel}
        confirmVariant={confirmDialog?.confirmVariant}
        onClose={() => setConfirmDialog(null)}
        onConfirm={() => {
          const pendingAction = confirmDialog?.onConfirm;
          setConfirmDialog(null);
          if (pendingAction) {
            void pendingAction();
          }
        }}
      />
    </Navbar>
  );
};

export default Header;
