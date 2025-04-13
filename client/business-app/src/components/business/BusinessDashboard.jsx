import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Nav, Tab, Alert } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { GET_BUSINESS_PROFILE } from '../../graphql/queries';
import { 
  RESPOND_TO_REVIEW 
} from '../../graphql/mutations';
import BusinessProfile from './BusinessProfile';
import OffersList from './Offers/OffersList';
import ReviewsList from './Reviews/ReviewsList';

const BusinessDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [notification, setNotification] = useState({ show: false, message: '', variant: 'info' });

  // Simulate user authentication
  useEffect(() => {
    const loggedInUser = {
      id: localStorage.getItem('userId') || 'sample-user-id',
      role: 'BusinessOwner',
      username: localStorage.getItem('username') || 'SampleBusinessOwner'
    };
    setUser(loggedInUser);
  }, []);

  // Fetch business profile data
  const { loading, error, data, refetch } = useQuery(GET_BUSINESS_PROFILE, {
    variables: { ownerId: user?.id },
    skip: !user?.id,
    fetchPolicy: 'network-only',
    onError: (error) => console.error("GraphQL error:", error)
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
        <Col>
          <h2 className="mb-0">Business Owner Dashboard</h2>
          <p className="text-muted">Manage your business profile, promotions, and customer reviews</p>
        </Col>
      </Row>

      <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
        <Row>
          <Col md={3} lg={2}>
            <Card className="mb-4">
              <Card.Body className="p-0">
                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <Nav.Link eventKey="profile" className="rounded-0">Profile</Nav.Link>
                  </Nav.Item>
                  {hasBusinessProfile && (
                    <>
                      <Nav.Item>
                        <Nav.Link eventKey="promotions" className="rounded-0">Promotions</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="reviews" className="rounded-0">Reviews</Nav.Link>
                      </Nav.Item>
                    </>
                  )}
                </Nav>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={9} lg={10}>
            <Card>
              <Card.Body>
                <Tab.Content>
                  <Tab.Pane eventKey="profile">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h3 className="mb-0">Business Profile</h3>
                    </div>
                    {hasBusinessProfile ? (
                      <>
                        <BusinessProfile 
                          profile={data.businessProfileByOwner} 
                          onlyDisplay={true}
                        />
                        
                        {/* Added business action buttons here */}
                        <div className="mt-4">
                          <h4 className="mb-3">Quick Actions</h4>
                          <div className="d-flex flex-wrap gap-2">
                            <Button variant="primary" onClick={() => navigate('/business/create-offer')}>
                              Create New Offer
                            </Button>
                            <Button variant="outline-primary" onClick={() => navigate('/business/offers')}>
                              View All Offers
                            </Button>
                            <Button variant="outline-primary" onClick={() => navigate('/business/reviews')}>
                              View All Reviews
                            </Button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <Alert variant="info">
                        No business profile found. Please create one through the GraphQL API.
                      </Alert>
                    )}
                  </Tab.Pane>
                  
                  {hasBusinessProfile && (
                    <>
                      <Tab.Pane eventKey="promotions">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                          <h3 className="mb-0">Business Promotions</h3>
                          <Button variant="primary" onClick={() => navigate('/business/create-offer')}>
                            Create New Promotion
                          </Button>
                        </div>
                        <OffersList 
                          offers={data.businessProfileByOwner.offers || []}
                        />
                      </Tab.Pane>
                      
                      <Tab.Pane eventKey="reviews">
                        <h3 className="mb-3">Customer Reviews</h3>
                        <ReviewsList 
                          reviews={data.businessProfileByOwner.reviews || []} 
                          onRespondToReview={handleRespondToReview} 
                        />
                      </Tab.Pane>
                    </>
                  )}
                </Tab.Content>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
};

export default BusinessDashboard;