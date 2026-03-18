import type { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Navbar from "react-bootstrap/Navbar";
import Row from "react-bootstrap/Row";
import { useAuth } from "@/hooks/auth/useAuth";
import { useDarkMode } from "@/hooks/theme/useDarkMode";
import { CacheService } from "@/lib/api/client";
import { useGlobalAlert } from "@/hooks/alerts/useGlobalAlert";
import {
  BrightnessHighIcon,
  CodeSlashIcon,
  MoonStarsIcon,
} from "@/assets/icons";

const Header = ({ text }: { text: string }) => {
  const { logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const { triggerAlert } = useGlobalAlert();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleLogoClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate("/");
  };

  const handleClearCache = async (error: unknown) => {
    if (error) {
      triggerAlert("Error clearing cache", "danger");
    } else {
      triggerAlert("Cache cleared successfully", "success");
    }
  };

  const onClearCache = async () => {
    try {
      await CacheService.deleteV1AlbumCache();
      handleClearCache(null);
    } catch (error) {
      handleClearCache(error);
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
              <Form.Check
                type='switch'
                id='header-dark-mode-switch'
                className='mb-0'
                label={
                  isDarkMode ? (
                    <MoonStarsIcon width={16} height={16} color='black' />
                  ) : (
                    <BrightnessHighIcon width={16} height={16} />
                  )
                }
                checked={isDarkMode}
                onChange={toggleDarkMode}
                aria-label='Toggle dark mode'
              />
              <Button
                type='button'
                variant='outline-danger'
                onClick={onClearCache}
                data-testid='clear-cache-button'
              >
                Clear Cache
              </Button>
              <Button type='button' variant='outline-primary' onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
};

export default Header;
