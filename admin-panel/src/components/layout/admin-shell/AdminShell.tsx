import { useState, type PropsWithChildren } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import Nav from "react-bootstrap/Nav";
import Offcanvas from "react-bootstrap/Offcanvas";
import {
  BookOpen,
  Bot,
  ChevronDown,
  FileUser,
  FolderKanban,
  Image,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Settings,
  Sun,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import config from "@/config/app-config";
import { useAuth } from "@/hooks/auth/useAuth";
import { useDarkMode } from "@/hooks/theme/useDarkMode";
import { useOptionalGlobalAlert } from "@/hooks/alerts/useOptionalGlobalAlert";
import {
  AccountService,
  CacheControllerService,
  CacheService,
} from "@/lib/api/client";
import { getApiErrorMessage } from "@/lib/api/errors";
import { navigateExternal } from "@/lib/navigation/external";
import ConfirmDialog from "@/components/shared/ConfirmDialog";

const primaryNavigation = [
  { label: "Overview", path: "/", icon: LayoutDashboard },
  { label: "Projects", path: "/projects", icon: FolderKanban },
  { label: "CV", path: "/cv", icon: FileUser },
  { label: "Albums", path: "/albums", icon: Image },
  { label: "CV Generator", path: "/cv-generator", icon: BookOpen },
  { label: "LLM Config", path: "/llm", icon: Bot },
] as const;

const cvNavigation = [
  { label: "Work experience", path: "/cv/work-experience" },
  { label: "Education", path: "/cv/education" },
  { label: "Skills", path: "/cv/skills" },
  { label: "Certifications", path: "/cv/certifications" },
] as const;

type PendingAction = "clear-cache" | "delete-account" | "logout" | null;

export function AdminShell({ children }: PropsWithChildren) {
  const [showNavigation, setShowNavigation] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { state, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { triggerAlert } = useOptionalGlobalAlert();
  const cvExpanded =
    location.pathname.startsWith("/cv/") &&
    location.pathname !== "/cv-generator";

  const initials =
    `${state.firstName?.[0] ?? ""}${state.lastName?.[0] ?? ""}` || "NA";

  const closeAndNavigate = (path: string) => {
    setShowNavigation(false);
    navigate(path);
  };

  const runPendingAction = async () => {
    const action = pendingAction;
    setPendingAction(null);
    try {
      if (action === "clear-cache") {
        await Promise.all([
          CacheControllerService.createCache(),
          CacheService.deleteV1AlbumCache(),
        ]);
        triggerAlert("Caches cleared successfully", "success");
      } else if (action === "delete-account") {
        await AccountService.deleteV1Account();
        await logout(window.location.origin);
      } else if (action === "logout") {
        await logout();
      }
    } catch (error) {
      triggerAlert(getApiErrorMessage(error, "Action failed"), "danger");
    }
  };

  const navigation = (
    <>
      <button
        className="admin-brand"
        type="button"
        onClick={() => closeAndNavigate("/")}
      >
        <span className="admin-brand-mark" aria-hidden="true">
          &lt;/&gt;
        </span>
        <span>Admin</span>
      </button>
      <Nav className="admin-nav flex-column" aria-label="Primary navigation">
        {primaryNavigation.map(({ label, path, icon: Icon }) => (
          <div key={path}>
            <Nav.Link
              as={NavLink}
              to={path}
              end={path === "/" || path === "/cv"}
              onClick={() => setShowNavigation(false)}
              className="admin-nav-link"
            >
              <Icon size={19} aria-hidden="true" />
              <span>{label}</span>
              {label === "CV" ? (
                <ChevronDown size={15} className="ms-auto" />
              ) : null}
            </Nav.Link>
            {label === "CV" && cvExpanded ? (
              <Nav className="admin-subnav flex-column">
                {cvNavigation.map((item) => (
                  <Nav.Link
                    key={item.path}
                    as={NavLink}
                    to={item.path}
                    onClick={() => setShowNavigation(false)}
                  >
                    {item.label}
                  </Nav.Link>
                ))}
              </Nav>
            ) : null}
          </div>
        ))}
      </Nav>
      <div className="admin-sidebar-footer">
        <Button
          variant="link"
          className="admin-footer-action"
          onClick={toggleDarkMode}
        >
          {isDarkMode ? <Moon size={19} /> : <Sun size={19} />}
          <span>{isDarkMode ? "Dark" : "Light"}</span>
        </Button>
        <Dropdown drop="up">
          <Dropdown.Toggle variant="link" className="admin-profile-toggle">
            <span className="admin-avatar">{initials}</span>
            <span className="text-truncate">
              {state.firstName || "Profile"}
            </span>
          </Dropdown.Toggle>
          <Dropdown.Menu className="shadow-sm">
            <Dropdown.Item
              onClick={() =>
                navigateExternal(
                  `${config.keycloakUrl}/realms/${config.keycloakRealm}/account`,
                )
              }
            >
              <UserRound size={16} /> Profile
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setPendingAction("clear-cache")}>
              <Settings size={16} /> Clear caches
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => setPendingAction("logout")}>
              <LogOut size={16} /> Logout
            </Dropdown.Item>
            <Dropdown.Item
              className="text-danger"
              onClick={() => setPendingAction("delete-account")}
            >
              <Trash2 size={16} /> Delete account
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </>
  );

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar d-none d-lg-flex">{navigation}</aside>
      <header className="admin-mobile-header d-lg-none">
        <Button
          variant="link"
          aria-label="Open navigation"
          onClick={() => setShowNavigation(true)}
        >
          <Menu size={24} />
        </Button>
        <button
          type="button"
          className="admin-mobile-brand"
          onClick={() => navigate("/")}
        >
          <span aria-hidden="true">&lt;/&gt;</span> Admin
        </button>
        <span className="admin-avatar">{initials}</span>
      </header>
      <Offcanvas
        show={showNavigation}
        onHide={() => setShowNavigation(false)}
        className="admin-offcanvas"
      >
        <Offcanvas.Header className="justify-content-end">
          <Button
            variant="link"
            aria-label="Close navigation"
            onClick={() => setShowNavigation(false)}
          >
            <X />
          </Button>
        </Offcanvas.Header>
        <Offcanvas.Body>{navigation}</Offcanvas.Body>
      </Offcanvas>
      <main className="admin-main">{children}</main>
      <ConfirmDialog
        isOpen={pendingAction !== null}
        title={
          pendingAction === "delete-account"
            ? "Delete account"
            : pendingAction === "clear-cache"
              ? "Clear caches"
              : "Logout"
        }
        message={
          pendingAction === "delete-account"
            ? "This permanently deletes your account. This action cannot be undone."
            : `Are you sure you want to ${pendingAction === "clear-cache" ? "clear all caches" : "logout"}?`
        }
        confirmLabel={
          pendingAction === "delete-account" ? "Delete account" : "Confirm"
        }
        confirmVariant={
          pendingAction === "delete-account" ? "danger" : "primary"
        }
        onClose={() => setPendingAction(null)}
        onConfirm={() => void runPendingAction()}
      />
    </div>
  );
}
