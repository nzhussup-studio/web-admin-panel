import type { ReactNode } from "react";
import { Menu, X } from "lucide-react";
import Button from "@/components/ui/button";
import { BrandLogo } from "@/components/ui/brand-logo";
import Offcanvas from "react-bootstrap/Offcanvas";

interface MobileNavigationProps {
  isOpen: boolean;
  initials: string;
  children: ReactNode;
  onOpen: () => void;
  onClose: () => void;
  onHome: () => void;
}

export function MobileNavigation({
  isOpen,
  initials,
  children,
  onOpen,
  onClose,
  onHome,
}: MobileNavigationProps) {
  return (
    <>
      <header className="admin-mobile-header d-lg-none">
        <Button variant="link" aria-label="Open navigation" onClick={onOpen}>
          <Menu size={24} />
        </Button>
        <Button variant="link" className="admin-mobile-brand" onClick={onHome}>
          <BrandLogo />
          Admin
        </Button>
        <span className="admin-avatar">{initials}</span>
      </header>
      <Offcanvas show={isOpen} onHide={onClose} className="admin-offcanvas">
        <Offcanvas.Header className="justify-content-end">
          <Button
            variant="link"
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
