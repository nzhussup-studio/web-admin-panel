import type { ReactNode } from "react";
import { Menu, X } from "lucide-react";
import Button from "@/components/ui/button";
import { BrandLogo } from "@/components/ui/brand-logo";
import Offcanvas from "react-bootstrap/Offcanvas";
import { AccountMenu } from "@/features/account";
import type { AccountAction } from "@/components/navigation/sidebar";

interface MobileNavigationProps {
  isOpen: boolean;
  initials: string;
  profileName: string;
  children: ReactNode;
  onOpen: () => void;
  onClose: () => void;
  onHome: () => void;
  onProfile: () => void;
  onAccountAction: (action: AccountAction) => void;
}

export function MobileNavigation({
  isOpen,
  initials,
  profileName,
  children,
  onOpen,
  onClose,
  onHome,
  onProfile,
  onAccountAction,
}: MobileNavigationProps) {
  return (
    <>
      <header className="admin-mobile-header d-lg-none">
        <Button variant="link" aria-label="Open navigation" onClick={onOpen}>
          <Menu size={24} />
        </Button>
        <Button variant="link" className="admin-mobile-brand" onClick={onHome}>
          <BrandLogo />
          Admin Panel
        </Button>
        <AccountMenu
          compact
          drop="down"
          initials={initials}
          profileName={profileName}
          onProfile={onProfile}
          onAction={onAccountAction}
        />
      </header>
      <Offcanvas show={isOpen} onHide={onClose} className="admin-offcanvas">
        <Offcanvas.Header className="justify-content-end">
          <Button
            variant="link"
            className="admin-offcanvas-close"
            aria-label="Close navigation"
            onClick={onClose}
          >
            <X />
          </Button>
        </Offcanvas.Header>
        <Offcanvas.Body>{children}</Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
