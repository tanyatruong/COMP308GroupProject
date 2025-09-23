import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Container, Nav, Navbar, Button, NavDropdown } from "react-bootstrap";
import { useAuth } from '../contexts/AuthContext';

const SimpleApp = () => {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading...</p>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div className="App">
      <Navbar bg="dark" variant="dark" expand="lg" className="px-2">
        <Container>
          <Navbar.Brand as={Link} to="/" className="text-white">
            Community Platform
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/resident/bulletinboard">Bulletin Board</Nav.Link>
              <Nav.Link as={Link} to="/resident/marketplace">Marketplace</Nav.Link>
              <Nav.Link as={Link} to="/resident/neighborhoodhelprequests">Help Requests</Nav.Link>
            </Nav>
            <Nav className="ms-auto">
              {user ? (
                <NavDropdown 
                  title={<span className="text-white">{user.username || 'Account'} <i className="bi bi-chevron-down"></i></span>} 
                  align="end" 
                  menuVariant="dark"
                >
                  <NavDropdown.Item onClick={handleLogout} className="text-dark">
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Button 
                  variant="primary" 
                  onClick={() => { window.location.href = 'http://localhost:5173'; }}
                >
                  Login
                </Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container fluid className="mt-3">
        <Routes>
          <Route
            path="/"
            element={
              <div className="text-center p-5">
                <h2>Welcome to the Community Platform</h2>
                <p className="lead">
                  {user ? `Hello ${user.username}! You are logged in as a ${user.role}.` : 'Please log in to access your dashboard.'}
                </p>
                {user && (
                  <div className="mt-4">
                    <p>User ID: {user.id}</p>
                    <p>Role: {user.role}</p>
                  </div>
                )}
              </div>
            }
          />
          <Route path="/resident" element={
            <div className="text-center p-5">
              <h2>Resident Dashboard</h2>
              <p>This is the resident dashboard for {user?.username || 'you'}.</p>
            </div>
          } />
          <Route path="*" element={
            <div className="text-center p-5">
              <h2>Page Not Found</h2>
              <p>The page you're looking for doesn't exist.</p>
              <Button 
                variant="primary" 
                onClick={() => window.location.href = '/'}
              >
                Go Home
              </Button>
            </div>
          } />
        </Routes>
      </Container>
    </div>
  );
};

export default SimpleApp;
