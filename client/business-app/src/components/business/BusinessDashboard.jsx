import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { GET_BUSINESS_PROFILE } from '../../graphql/queries';
import { RESPOND_TO_REVIEW } from '../../graphql/mutations';
import BusinessProfile from './BusinessProfile';
import CreateBusinessProfile from './CreateBusinessProfile';
import OffersList from './Offers/OffersList';
import ReviewsList from './Reviews/ReviewsList';

const BusinessDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', variant: 'info' });

  // Set up user data from localStorage
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    
    console.log("LocalStorage userId:", userId);
    console.log("LocalStorage username:", username);
    console.log("LocalStorage role:", role);
    
    if (userId && username && role) {
      const loggedInUser = {
        id: userId,
        role: role,
        username: username
      };
      console.log("Setting user state:", loggedInUser);
      setUser(loggedInUser);
      setIsLoggedIn(true);
    } else {
      // For testing purposes only - but mark as not logged in
      console.log("No userId in localStorage, using test ID");
      setUser({
        id: '67fbccd0b088a381cdcef65c',
        role: 'BusinessOwner',
        username: 'Test User'
      });
      setIsLoggedIn(false);
    }
  }, []);

  // Fetch business profile
  const { loading, error, data, refetch } = useQuery(GET_BUSINESS_PROFILE, {
    variables: { ownerId: user?.id },
    skip: !user?.id,
    fetchPolicy: 'network-only',
    onError: (err) => console.error("GraphQL error:", err)
  });

  const [respondToReview] = useMutation(RESPOND_TO_REVIEW, {
    onCompleted: () => {
      showNotification('Response added successfully!', 'success');
      refetch();
    },
    onError: (error) => {
      showNotification(`Error adding response: ${error.message}`, 'danger');
    }
  });

  const showNotification = (message, variant = 'info') => {
    setNotification({ show: true, message, variant });
    setTimeout(() => {
      setNotification({ ...notification, show: false });
    }, 5000);
  };

  const handleRespondToReview = async (reviewId, response) => {
    try {
      await respondToReview({
        variables: {
          reviewId,
          response
        }
      });
    } catch (err) {
      console.error("Error responding to review:", err);
    }
  };

  const handleProfileCreated = () => {
    showNotification('Business profile created successfully!', 'success');
    refetch();
  };

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    
    // Update state
    setIsLoggedIn(false);
    setUser(null);
    
    // Navigate to home
    navigate('/');
  };

  const handleLogin = () => {
    // Open shell app (auth) in new tab
    window.open('http://localhost:5173', '_blank');
  };

  // Navigation functions
  const navigateToProfile = () => navigate('/business/profile');
  const navigateToOffers = () => navigate('/business/offers');
  const navigateToReviews = () => navigate('/business/reviews');
  const navigateToCreateOffer = () => navigate('/business/create-offer');

  // Check if user has correct role
  if (isLoggedIn && user?.role !== 'BusinessOwner') {
    return (
      <div className="text-center p-5">
        <h2>Access Denied</h2>
        <p>This dashboard is only available for Business Owners.</p>
        <Button 
          variant="primary" 
          onClick={() => window.location.href = '/'}
        >
          Go Home
        </Button>
      </div>
    );
  }

  if (loading) return <div className="text-center p-5">Loading...</div>;
  
  const hasBusinessProfile = !error && data && data.businessProfileByOwner;

  return (
    <div className="App">
      {notification.show && (
        <Alert variant={notification.variant} onClose={() => setNotification({ ...notification, show: false })} dismissible className="m-3">
          {notification.message}
        </Alert>
      )}
  
      <div className="dashboard-header">
        <Container fluid>
          <Row className="align-items-center">
            <Col className="d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div>
                <h1 className="mb-2 fw-bold">🏢 Business Owner Dashboard</h1>
                <p className="mb-0 opacity-75">Manage your business profile, promotions, and customer reviews</p>
              </div>
              {!isLoggedIn && (
                <div className="text-center">
                  <p className="text-muted mb-3">Please log in to access your business dashboard</p>
                  <Button variant="primary" onClick={handleLogin} className="px-4 py-2">
                    <i className="bi bi-box-arrow-in-right me-2"></i>Login
                  </Button>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </div>

      <Container fluid className="py-4">
  
      {!hasBusinessProfile ? (
        <CreateBusinessProfile onSuccess={handleProfileCreated} />
      ) : (
        <>
          {/* Navigation Toolbar */}
          <Row className="mb-4">
            <Col>
              <div className="btn-group d-flex flex-wrap gap-3">
                <Button variant="primary" className="flex-fill px-4 py-3" onClick={navigateToProfile}>
                  <i className="bi bi-building me-2"></i>Business Profile
                </Button>
                <Button variant="outline-primary" className="flex-fill px-4 py-3" onClick={navigateToOffers}>
                  <i className="bi bi-megaphone me-2"></i>Promotions
                </Button>
                <Button variant="outline-primary" className="flex-fill px-4 py-3" onClick={navigateToReviews}>
                  <i className="bi bi-star me-2"></i>Customer Reviews
                </Button>
              </div>
            </Col>
          </Row>
  
          {/* Dashboard Overview Cards */}
          <Row className="g-4 mb-4">
            <Col md={4}>
              <Card className="h-100 dashboard-card fade-in">
                <Card.Body className="text-center p-4">
                  <div className="mb-3">
                    <i className="bi bi-building text-primary" style={{fontSize: '3rem'}}></i>
                  </div>
                  <h5 className="fw-bold mb-3">Business Profile</h5>
                  <p className="text-muted mb-3">{data.businessProfileByOwner.businessName}</p>
                  <Button variant="primary" onClick={navigateToProfile} className="px-4">
                    <i className="bi bi-eye me-2"></i>View Profile
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 dashboard-card fade-in">
                <Card.Body className="text-center p-4">
                  <div className="mb-3">
                    <i className="bi bi-megaphone text-success" style={{fontSize: '3rem'}}></i>
                  </div>
                  <h5 className="fw-bold mb-3">Promotions</h5>
                  <p className="text-muted mb-3">{data.businessProfileByOwner.offers?.length || 0} Active Offers</p>
                  <div className="d-flex justify-content-center gap-2">
                    <Button variant="success" onClick={navigateToCreateOffer} className="px-3">
                      <i className="bi bi-plus me-1"></i>New
                    </Button>
                    <Button variant="outline-primary" onClick={navigateToOffers} className="px-3">
                      <i className="bi bi-list me-1"></i>All
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 dashboard-card fade-in">
                <Card.Body className="text-center p-4">
                  <div className="mb-3">
                    <i className="bi bi-star text-warning" style={{fontSize: '3rem'}}></i>
                  </div>
                  <h5 className="fw-bold mb-3">Customer Reviews</h5>
                  <p className="text-muted mb-3">{data.businessProfileByOwner.reviews?.length || 0} Reviews</p>
                  <Button variant="warning" onClick={navigateToReviews} className="px-4">
                    <i className="bi bi-star me-2"></i>View Reviews
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
  
          {/* Welcome Section */}
          <Card className="dashboard-card">
            <Card.Header className="bg-gradient text-white border-0" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
              <h4 className="mb-0">
                <i className="bi bi-info-circle me-2"></i>Welcome to your Business Dashboard
              </h4>
            </Card.Header>
            <Card.Body className="p-4">
              <p className="text-muted mb-3">Here's what you can do with your business dashboard:</p>
              <Row>
                <Col md={4}>
                  <div className="d-flex align-items-center mb-3">
                    <i className="bi bi-check-circle-fill text-success me-3" style={{fontSize: '1.5rem'}}></i>
                    <div>
                      <h6 className="mb-1">COMP308 - Emerging Technologies</h6>
                      <small className="text-muted">Winter 2025</small>
                    </div>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="d-flex align-items-center mb-3">
                    <i className="bi bi-people-fill text-primary me-3" style={{fontSize: '1.5rem'}}></i>
                    <div>
                      <h6 className="mb-1">Group 1 Project</h6>
                      <small className="text-muted">Community Platform</small>
                    </div>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="d-flex align-items-center mb-3">
                    <i className="bi bi-person-badge-fill text-warning me-3" style={{fontSize: '1.5rem'}}></i>
                    <div>
                      <h6 className="mb-1">Tanya Truong</h6>
                      <small className="text-muted">Business Owner Feature</small>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </>
      )}
      </Container>
    </div>
  );
};

export default BusinessDashboard;