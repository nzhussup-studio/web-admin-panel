import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useAuth } from "@/hooks/auth/useAuth";
import { AuthControllerService } from "@/lib/api/client";
import { useDarkMode } from "@/hooks/theme/useDarkMode";
import Loading from "@/components/states/LoadingState";
import ThemeToggle from "@/components/shared/ThemeToggle";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    setLoading(true);

    try {
      const response = await AuthControllerService.login({
        username,
        password,
      });

      const { token, expiration } = response;
      if (!token || !expiration) {
        throw new Error("Invalid token or expiration data");
      }

      const validateResponse = await AuthControllerService.validateToken({
        token,
      });
      const roles = validateResponse.roles || [];

      if (!roles.includes("ROLE_ADMIN")) {
        throw new Error("Only administrators can access this page.");
      }

      login(token, expiration);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const loginForm = (
    <>
      <Form.Floating className='mb-3'>
        <Form.Control
          type='text'
          id='floatingInput'
          placeholder='Username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label htmlFor='floatingInput'>Username</label>
      </Form.Floating>

      <Form.Floating className='mb-3'>
        <Form.Control
          type='password'
          id='floatingPassword'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label htmlFor='floatingPassword'>Password</label>
      </Form.Floating>

      <Button
        className='w-100 py-2'
        variant={isDarkMode ? "secondary" : "primary"}
        type='submit'
      >
        Sign in
      </Button>
    </>
  );

  return (
    <div className={`d-flex align-items-center py-4 app-login-page ${isDarkMode ? "dark-mode" : ""}`}>
      <Container>
        <Row className='justify-content-center'>
          <Col md={5} lg={4}>
            <Card className='app-login-card border-0'>
              <Card.Body className='p-4 p-lg-5'>
                <main className='form-signin w-100 m-auto'>
                  <form onSubmit={handleSubmit}>
                <div className='d-flex justify-content-between align-items-center mb-4'>
                  <h1
                    className='h3 mb-3 fw-semibold app-login-title'
                  >
                    Please sign in
                  </h1>
                  <ThemeToggle isDarkMode={isDarkMode} onToggle={toggleDarkMode} />
                </div>

                {error && <div className='alert alert-danger'>{error}</div>}

                {loading ? <Loading /> : loginForm}
                <p className='mt-5 mb-0 text-secondary'>
                  © by nzhussup. All rights reserved!
                </p>
                  </form>
                </main>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;
