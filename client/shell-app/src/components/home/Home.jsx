import React from 'react'
import { Container, Card, Button, Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import './home.css';

const Home = () => {
  const navigate = useNavigate();
  
  const handleSignUp = () => {
    navigate('/signup');
  };
  
  const handleLogIn = () => {
    navigate('/login');
  };

  return (
    <div className="home-container">
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Row className="w-100">
          <Col lg={8} className="mx-auto">
            <Card className="welcome-card">
              <Card.Body className="text-center p-5">
                <div className="welcome-icon mb-4">
                  <i className="bi bi-house-heart" style={{fontSize: '4rem', color: '#667eea'}}></i>
                </div>
                
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
                    className="welcome-btn"
                    onClick={handleLogIn}
                  >
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Sign In
                  </Button>
                </div>

                <div className="demo-info mt-4">
                  <small className="text-muted">
                    <i className="bi bi-info-circle me-1"></i>
                    Demo accounts available - check the documentation for login credentials
                  </small>
                  <br />
                  <small className="text-muted">
                    <i className="bi bi-arrow-right me-1"></i>
                    After login, you'll be redirected to the appropriate dashboard
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Home
