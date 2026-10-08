import { LogIn, LogOut, Trash2, UserRound } from "lucide-react";
import Dropdown from "react-bootstrap/Dropdown";
import type { AccountAction } from "@/components/navigation/sidebar";

interface AccountMenuProps {
  initials: string;
  profileName: string;
  isAuthenticated: boolean;
  onLogin: () => void;
  onProfile: () => void;
  onAction: (action: AccountAction) => void;
  compact?: boolean;
  drop?: "up" | "down";
}

export function AccountMenu({
  initials,
  profileName,
  isAuthenticated,
  onLogin,
  onProfile,
  onAction,
  compact = false,
  drop = "up",
}: AccountMenuProps) {
  return (
    <Dropdown drop={drop} align={compact ? "end" : undefined}>
      <Dropdown.Toggle
        variant="link"
        className={`admin-profile-toggle${compact ? " admin-profile-toggle-compact" : ""}`}
        aria-label={compact ? "Open account menu" : undefined}
      >
        <span className="admin-avatar">{initials}</span>
        {!compact ? (
          <span className="admin-profile-label text-truncate">
            {profileName}
          </span>
        ) : null}
      </Dropdown.Toggle>
      <Dropdown.Menu className="shadow-sm">
        {isAuthenticated ? (
          <>
            <Dropdown.Item onClick={onProfile}>
              <UserRound size={16} /> Profile
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => onAction("logout")}>
              <LogOut size={16} /> Logout
            </Dropdown.Item>
            <Dropdown.Item
              className="text-danger"
              onClick={() => onAction("delete-account")}
            >
              <Trash2 size={16} /> Delete account
            </Dropdown.Item>
          </>
        ) : (
          <Dropdown.Item onClick={onLogin}>
            <LogIn size={16} /> Log in
          </Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
}
