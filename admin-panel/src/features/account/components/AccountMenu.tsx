import { LogOut, Trash2, UserRound } from "lucide-react";
import Dropdown from "react-bootstrap/Dropdown";
import type { AccountAction } from "@/components/navigation/sidebar";

interface AccountMenuProps {
  initials: string;
  profileName: string;
  onProfile: () => void;
  onAction: (action: AccountAction) => void;
}

export function AccountMenu({
  initials,
  profileName,
  onProfile,
  onAction,
}: AccountMenuProps) {
  return (
    <Dropdown drop="up">
      <Dropdown.Toggle variant="link" className="admin-profile-toggle">
        <span className="admin-avatar">{initials}</span>
        <span className="admin-profile-label text-truncate">{profileName}</span>
      </Dropdown.Toggle>
      <Dropdown.Menu className="shadow-sm">
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
      </Dropdown.Menu>
    </Dropdown>
  );
}
