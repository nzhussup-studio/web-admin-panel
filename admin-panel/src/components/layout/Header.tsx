import type { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Row from "react-bootstrap/Row";
import { useAuth } from "@/hooks/auth/useAuth";
import { useDarkMode } from "@/hooks/theme/useDarkMode";
import { CacheService } from "@/lib/api/client";
import { useOptionalGlobalAlert } from "@/hooks/alerts/useOptionalGlobalAlert";
import { getApiErrorMessage } from "@/lib/api/errors";
import { CodeSlashIcon } from "@/assets/icons";
import ThemeToggle from "@/components/shared/ThemeToggle";

interface HeaderProps {
  text: string;
  showClearCacheButton?: boolean;
  authActionLabel?: "Login" | "Logout";
}

const Header = ({
  text,
  showClearCacheButton = true,
  authActionLabel = "Logout",
}: HeaderProps) => {
  const { login, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const { triggerAlert } = useOptionalGlobalAlert();

  const handleAuthAction = () => {
    if (authActionLabel === "Login") {
      void login();
      return;
    }

    void logout();
  };

  const handleLogoClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    if (authActionLabel === "Login") {
      void login();
      return;
    }

    navigate("/");
  };

  const onClearCache = async () => {
    try {
      await CacheService.deleteV1AlbumCache();
      triggerAlert("Cache cleared successfully", "success");
    } catch (error) {
      triggerAlert(getApiErrorMessage(error, "Failed to clear cache"), "danger");
    }
  };

  return (
    <Navbar bg='body' expand='md' className='py-3 mb-4 app-header-shell'>
      <Container>
        <Row className='w-100 align-items-center gy-3'>
          <Col xs={12} md={4} className='d-flex justify-content-center justify-content-md-start'>
            <Navbar.Brand
              href='/'
              className='d-inline-flex align-items-center mb-0'
              onClick={handleLogoClick}
            >
              <span className='visually-hidden'>Home</span>
              <CodeSlashIcon width={40} height={40} />
            </Navbar.Brand>
          </Col>

          <Col xs={12} md={4} className='text-center'>
            <Navbar.Text className='fw-semibold fs-4 text-body m-0 d-block'>
              {text}
            </Navbar.Text>
          </Col>

          <Col xs={12} md={4}>
            <div className='d-flex flex-wrap align-items-center justify-content-center justify-content-md-end gap-2'>
              <ThemeToggle isDarkMode={isDarkMode} onToggle={toggleDarkMode} />
              {showClearCacheButton && (
                <Button
                  type='button'
                  variant='outline-danger'
                  onClick={onClearCache}
                  data-testid='clear-cache-button'
                >
                  Clear Cache
                </Button>
              )}
              <Button type='button' variant='outline-primary' onClick={handleAuthAction}>
                {authActionLabel}
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
};

export default Header;
