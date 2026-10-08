import { useState, type PropsWithChildren } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getApiErrorMessage } from "@/api";
import { MobileNavigation } from "@/components/navigation/mobile-navigation";
import { Sidebar, type AccountAction } from "@/components/navigation/sidebar";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useOptionalGlobalAlert } from "@/providers/alerts";
import { hasAdminRole, useAuth } from "@/providers/auth";
import { useDarkMode } from "@/providers/theme";
import { deleteAccount } from "@/features/account";
import {
  keycloakAccountUrl,
  keycloakAdminRealmUrl,
} from "@/providers/auth/keycloak";
import { ErrorBoundary } from "@/components/feedback/error-boundary";

const SIDEBAR_STORAGE_KEY = "isSidebarCollapsed";

const getStoredSidebarState = () => {
  try {
    return window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
};

export function AdminShell({ children }: PropsWithChildren) {
  const [showNavigation, setShowNavigation] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
    getStoredSidebarState,
  );
  const [pendingAction, setPendingAction] = useState<AccountAction | null>(
    null,
  );
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
      if (action === "delete-account") {
        await deleteAccount();
        await logout(window.location.origin);
      } else if (action === "logout") {
        await logout();
      }
    } catch (error) {
      triggerAlert(getApiErrorMessage(error, "Action failed"), "danger");
    }
  };

  const toggleSidebar = () => {
    setShowNavigation(false);
    setIsSidebarCollapsed((isCollapsed) => {
      const nextState = !isCollapsed;
      try {
        window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(nextState));
      } catch {
        // The sidebar still works when storage is unavailable.
      }
      return nextState;
    });
  };

  const renderSidebar = (showCollapseControl: boolean) => (
    <Sidebar
      cvExpanded={cvExpanded}
      initials={initials}
      profileName={state.firstName || "Profile"}
      isDarkMode={isDarkMode}
      isCollapsed={isSidebarCollapsed}
      isAdmin={hasAdminRole(state.roles)}
      authRealmUrl={keycloakAdminRealmUrl}
      onNavigate={closeAndNavigate}
      onThemeToggle={toggleDarkMode}
      onCollapseToggle={toggleSidebar}
      onProfile={() => window.location.assign(keycloakAccountUrl)}
      onAccountAction={setPendingAction}
      showCollapseControl={showCollapseControl}
    />
  );

  return (
    <div
      className={`admin-shell${isSidebarCollapsed ? " sidebar-collapsed" : ""}`}
    >
      <aside className="admin-sidebar d-none d-lg-flex">
        {renderSidebar(true)}
      </aside>
      <MobileNavigation
        isOpen={showNavigation}
        initials={initials}
        profileName={state.firstName || "Profile"}
        onOpen={() => setShowNavigation(true)}
        onClose={() => setShowNavigation(false)}
        onHome={() => navigate("/")}
        onProfile={() => window.location.assign(keycloakAccountUrl)}
        onAccountAction={setPendingAction}
      >
        {renderSidebar(false)}
      </MobileNavigation>
      <main className="admin-main">
        <ErrorBoundary resetKey={location.key}>{children}</ErrorBoundary>
      </main>
      <ConfirmDialog
        isOpen={pendingAction !== null}
        title={pendingAction === "delete-account" ? "Delete account" : "Logout"}
        message={
          pendingAction === "delete-account"
            ? "This permanently deletes your account. This action cannot be undone."
            : "Are you sure you want to logout?"
        }
        confirmLabel={
          pendingAction === "delete-account" ? "Delete account" : "Confirm"
        }
        confirmVariant={
          pendingAction === "delete-account" ? "danger" : "primary"
        }
        onClose={() => setPendingAction(null)}
        onConfirm={runPendingAction}
      />
    </div>
  );
}
