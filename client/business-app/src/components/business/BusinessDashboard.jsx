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
  const [notification, setNotification] = useState({ show: false, message: '', variant: 'info' });

  // Set up user data from localStorage
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    
    console.log("LocalStorage userId:", userId);
    console.log("LocalStorage username:", username);
    
    if (userId) {
      const loggedInUser = {
        id: userId,
        role: 'BusinessOwner',
        username: username || 'BusinessOwner'
      };
      console.log("Setting user state:", loggedInUser);
      setUser(loggedInUser);
    } else {
      // For testing purposes only
      console.log("No userId in localStorage, using test ID");
      setUser({
        id: '67fbccd0b088a381cdcef65c',
        role: 'BusinessOwner',
        username: 'Test User'
      });
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
    
    // Navigate to home
    navigate('/');
  };

  // Navigation functions
  const navigateToProfile = () => navigate('/business/profile');
  const navigateToOffers = () => navigate('/business/offers');
  const navigateToReviews = () => navigate('/business/reviews');
  const navigateToCreateOffer = () => navigate('/business/create-offer');

  if (loading) return <div className="text-center p-5">Loading...</div>;
  
  const hasBusinessProfile = !error && data && data.businessProfileByOwner;

  return (
    <Container fluid className="py-4">
      {notification.show && (
        <Alert variant={notification.variant} onClose={() => setNotification({ ...notification, show: false })} dismissible>
          {notification.message}
        </Alert>
      )}
  
      <Row className="mb-4">
        <Col className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h2 className="mb-0">Business Owner Dashboard</h2>
            <small className="text-muted">Manage your business profile, promotions, and reviews</small>
          </div>
          <Button variant="outline-danger" onClick={handleLogout}>
            Logout
          </Button>
        </Col>
      </Row>
  
      {!hasBusinessProfile ? (
        <CreateBusinessProfile onSuccess={handleProfileCreated} />
      ) : (
        <>
          {/* Navigation Toolbar */}
          <Row className="mb-4">
            <Col>
              <div className="btn-group d-flex flex-wrap gap-2">
                <Button variant="outline-primary" className="flex-fill" onClick={navigateToProfile}>
                  🏢 Profile
                </Button>
                <Button variant="outline-primary" className="flex-fill" onClick={navigateToOffers}>
                  💡 Promotions
                </Button>
                <Button variant="outline-primary" className="flex-fill" onClick={navigateToReviews}>
                  ⭐ Reviews
                </Button>
              </div>
            </Col>
          </Row>
  
          {/* Dashboard Overview Cards */}
          <Row className="g-4 mb-4">
            <Col md={4}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Body className="text-center">
                  <h5 className="fw-semibold">Business Profile</h5>
                  <p className="text-muted">{data.businessProfileByOwner.businessName}</p>
                  <Button variant="primary" onClick={navigateToProfile}>View Profile</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Body className="text-center">
                  <h5 className="fw-semibold">Promotions</h5>
                  <p className="text-muted">{data.businessProfileByOwner.offers?.length || 0} Active Offers</p>
                  <div className="d-flex justify-content-center gap-2">
                    <Button variant="primary" onClick={navigateToCreateOffer}>+ New</Button>
                    <Button variant="outline-primary" onClick={navigateToOffers}>View All</Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Body className="text-center">
                  <h5 className="fw-semibold">Customer Reviews</h5>
                  <p className="text-muted">{data.businessProfileByOwner.reviews?.length || 0} Reviews</p>
                  <Button variant="primary" onClick={navigateToReviews}>View Reviews</Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
  
          {/* Recent Activity */}
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0">
              <h5 className="mb-0">Welcome to your Business Dashboard</h5>
            </Card.Header>
            <Card.Body>
              <p className="text-muted">Here are a few introductions</p>
              <ul className="mb-0">
                <li>✅ COMP308 - Emerging Technologies | Winter 2025 </li>
                <li>✅ Representing from Group 1</li>
                <li>✅ Tanya Truong is in charge of the Business Owner feature.</li>
              </ul>
            </Card.Body>
          </Card>
        </>
      )}
    </Container>
  );
};

export default BusinessDashboard;