import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Button from "@/components/ui/button";
import { BrandLogo } from "@/components/ui/brand-logo";
import Nav from "react-bootstrap/Nav";
import {
  BookOpen,
  Bot,
  ChevronDown,
  ExternalLink,
  FileUser,
  FolderKanban,
  Image,
  LayoutDashboard,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldCheck,
  Sun,
} from "lucide-react";
import { AccountMenu } from "@/features/account";

export type AccountAction = "delete-account" | "logout";

interface SidebarProps {
  cvExpanded: boolean;
  initials: string;
  profileName: string;
  isDarkMode: boolean;
  isCollapsed: boolean;
  isAdmin: boolean;
  authRealmUrl: string;
  onNavigate: (path: string) => void;
  onThemeToggle: () => void;
  onCollapseToggle: () => void;
  onProfile: () => void;
  onAccountAction: (action: AccountAction) => void;
  showCollapseControl?: boolean;
}

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

export function Sidebar({
  cvExpanded,
  initials,
  profileName,
  isDarkMode,
  isCollapsed,
  isAdmin,
  authRealmUrl,
  onNavigate,
  onThemeToggle,
  onCollapseToggle,
  onProfile,
  onAccountAction,
  showCollapseControl = true,
}: SidebarProps) {
  const [isCvOpen, setIsCvOpen] = useState(cvExpanded);

  useEffect(() => {
    if (cvExpanded) setIsCvOpen(true);
  }, [cvExpanded]);

  return (
    <>
      <div className="admin-sidebar-header">
        <Button
          variant="link"
          className="admin-brand"
          aria-label="Open overview"
          title={isCollapsed ? "Overview" : undefined}
          onClick={() => onNavigate("/")}
        >
          <BrandLogo />
          <span className="admin-brand-label">Admin Panel</span>
        </Button>
      </div>
      {isAdmin ? (
        <Nav className="admin-nav flex-column" aria-label="Primary navigation">
          {primaryNavigation.map(({ label, path, icon: Icon }) => (
            <div key={path}>
              <div className={label === "CV" ? "admin-nav-parent" : ""}>
                <Nav.Link
                  as={NavLink}
                  to={path}
                  end={path === "/" || path === "/cv"}
                  onClick={() => onNavigate(path)}
                  className="admin-nav-link"
                  title={isCollapsed ? label : undefined}
                >
                  <Icon size={19} aria-hidden="true" />
                  <span className="admin-nav-label">{label}</span>
                </Nav.Link>
                {label === "CV" ? (
                  <Button
                    variant="link"
                    className="admin-nav-expand"
                    aria-label={
                      isCvOpen
                        ? "Collapse CV navigation"
                        : "Expand CV navigation"
                    }
                    aria-expanded={isCvOpen}
                    onClick={() => setIsCvOpen((isOpen) => !isOpen)}
                  >
                    <ChevronDown size={15} />
                  </Button>
                ) : null}
              </div>
              {label === "CV" && isCvOpen ? (
                <Nav className="admin-subnav flex-column">
                  {cvNavigation.map((item) => (
                    <Nav.Link
                      key={item.path}
                      as={NavLink}
                      to={item.path}
                      onClick={() => onNavigate(item.path)}
                    >
                      {item.label}
                    </Nav.Link>
                  ))}
                </Nav>
              ) : null}
            </div>
          ))}
          <Nav.Link
            href={authRealmUrl}
            target="_blank"
            rel="noreferrer"
            className="admin-nav-link"
            title={isCollapsed ? "Auth Realm" : undefined}
          >
            <ShieldCheck size={19} aria-hidden="true" />
            <span className="admin-nav-label">Auth Realm</span>
            <ExternalLink size={15} className="ms-auto" aria-hidden="true" />
          </Nav.Link>
        </Nav>
      ) : null}
      <div className="admin-sidebar-footer">
        {showCollapseControl ? (
          <Button
            variant="link"
            className="admin-sidebar-collapse admin-footer-action"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={onCollapseToggle}
          >
            {isCollapsed ? (
              <PanelLeftOpen size={19} />
            ) : (
              <PanelLeftClose size={19} />
            )}
            <span className="admin-footer-label">
              {isCollapsed ? "Expand" : "Collapse"}
            </span>
          </Button>
        ) : null}
        <Button
          variant="link"
          className="admin-footer-action"
          onClick={onThemeToggle}
          title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? <Sun size={19} /> : <Moon size={19} />}
          <span className="admin-footer-label">
            {isDarkMode ? "Light" : "Dark"}
          </span>
        </Button>
        <AccountMenu
          initials={initials}
          profileName={profileName}
          onProfile={onProfile}
          onAction={onAccountAction}
        />
      </div>
    </>
  );
}
