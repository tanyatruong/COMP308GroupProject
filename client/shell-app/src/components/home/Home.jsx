import React from 'react'
import { Container, Card, Button, Row, Col, Navbar, Nav, NavDropdown } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './home.css';

const Home = () => {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();
  
  const handleSignUp = () => {
    navigate('/signup');
  };
  
  const handleLogIn = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    logout();
  };

  const getRoleBasedRedirect = () => {
    const businessAppUrl = import.meta.env.VITE_BUSINESS_APP_URL || 'http://localhost:3003';
    if (user?.role === 'BusinessOwner') {
      return businessAppUrl;
    } else if (user?.role === 'Resident' || user?.role === 'CommunityOrganizer') {
      return `${businessAppUrl}/resident`;
    }
    return businessAppUrl;
  };

  if (loading) {
    return (
      <div className="home-container">
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading...</p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="home-container">
      <Navbar bg="dark" variant="dark" expand="lg" className="px-2">
        <Container>
          <Navbar.Brand className="text-white">
            Community Platform
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href={`${import.meta.env.VITE_BUSINESS_APP_URL || 'http://localhost:3003'}/resident/bulletinboard`}>Bulletin Board</Nav.Link>
              <Nav.Link href={`${import.meta.env.VITE_BUSINESS_APP_URL || 'http://localhost:3003'}/resident/marketplace`}>Marketplace</Nav.Link>
              <Nav.Link href={`${import.meta.env.VITE_BUSINESS_APP_URL || 'http://localhost:3003'}/resident/neighborhoodhelprequests`}>Help Requests</Nav.Link>
            </Nav>
            <Nav className="ms-auto">
              {user ? (
                <NavDropdown 
                  title={<span className="text-white">{user.username} <i className="bi bi-chevron-down"></i></span>} 
                  align="end" 
                  menuVariant="dark"
                  className="text-white"
                >
                  <NavDropdown.Item onClick={() => window.location.href = getRoleBasedRedirect()}>
                    Go to Dashboard
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Button 
                  variant="primary" 
                  onClick={handleLogIn}
                >
                  Login
                </Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Row className="w-100">
          <Col lg={8} className="mx-auto">
            <Card className="welcome-card">
              <Card.Body className="text-center p-5">
                <div className="welcome-icon mb-4">
                  <i className="bi bi-house-heart" style={{fontSize: '4rem', color: '#667eea'}}></i>
                </div>
                
                {user ? (
                  <>
                    <h1 className="welcome-title mb-3">
                      Welcome back, {user.username}!
                    </h1>
                    
                    <p className="welcome-subtitle mb-5">
                      You're logged in as a <strong>{user.role}</strong>. 
                      Access your dashboard to manage your community activities.
                    </p>

                    <div className="button-container">
                      <Button 
                        variant="primary" 
                        size="lg" 
                        className="welcome-btn me-3"
                        onClick={() => window.location.href = getRoleBasedRedirect()}
                      >
                        <i className="bi bi-speedometer2 me-2"></i>
                        Go to Dashboard
                      </Button>
                      <Button 
                        variant="outline-secondary" 
                        size="lg" 
                        className="welcome-btn me-3"
                        onClick={handleLogout}
                      >
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Logout
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <h1 className="welcome-title mb-3">
                      Welcome to the Community Portal
                    </h1>
                    
                    <p className="welcome-subtitle mb-5">
                      Connect with your neighbors, discover local businesses, and build a stronger community together. 
                      Join thousands of residents who are already making a difference in their neighborhoods.
                    </p>

                    <div className="features-row mb-5">
                      <Row className="g-4">
                        <Col md={4}>
                          <div className="feature-item">
                            <i className="bi bi-people-fill feature-icon"></i>
                            <h5>Community</h5>
                            <p>Connect with neighbors and build lasting relationships</p>
                          </div>
                        </Col>
                        <Col md={4}>
                          <div className="feature-item">
                            <i className="bi bi-shop feature-icon"></i>
                            <h5>Local Business</h5>
                            <p>Discover and support local businesses in your area</p>
                          </div>
                        </Col>
                        <Col md={4}>
                          <div className="feature-item">
                            <i className="bi bi-heart-fill feature-icon"></i>
                            <h5>Help & Support</h5>
                            <p>Offer help or request assistance from your community</p>
                          </div>
                        </Col>
                      </Row>
                    </div>

                    <div className="button-container">
                      <Button 
                        variant="primary" 
                        size="lg" 
                        className="welcome-btn me-3"
                        onClick={handleSignUp}
                      >
                        <i className="bi bi-person-plus me-2"></i>
                        Get Started
                      </Button>
                      <Button 
                        variant="outline-primary" 
                        size="lg" 
                        className="welcome-btn me-3"
                        onClick={handleLogIn}
                      >
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Sign In
                      </Button>
                    </div>

                    <div className="mt-4">
                      <h5 className="mb-3">Or access directly:</h5>
                      <div className="d-flex justify-content-center gap-3 flex-wrap">
                        <Button 
                          variant="success" 
                          size="lg" 
                          className="access-btn"
                          onClick={() => window.location.href = import.meta.env.VITE_BUSINESS_APP_URL || 'http://localhost:3003'}
                        >
                          <i className="bi bi-building me-2"></i>
                          Business View
                        </Button>
                        <Button 
                          variant="info" 
                          size="lg" 
                          className="access-btn"
                          onClick={() => window.location.href = `${import.meta.env.VITE_BUSINESS_APP_URL || 'http://localhost:3003'}/resident`}
                        >
                          <i className="bi bi-people me-2"></i>
                          Resident View
                        </Button>
                      </div>
                    </div>

                    <div className="demo-info mt-4">
                      <small className="text-muted">
                        <i className="bi bi-info-circle me-1"></i>
                        Demo accounts available - check the documentation for login credentials
                      </small>
                      <br />
                      <small className="text-muted">
                        <i className="bi bi-arrow-right me-1"></i>
                        Use the buttons above to access Business View or Resident View
                      </small>
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Home
