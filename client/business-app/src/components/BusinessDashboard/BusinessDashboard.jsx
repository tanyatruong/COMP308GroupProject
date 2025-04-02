import React from 'react';
import { useQuery } from '@apollo/client';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaShoppingBag, FaCommentAlt, FaStar, FaChartLine, FaReply } from 'react-icons/fa';
import { GET_BUSINESS_PROFILES } from '../../graphql/queries';
import { GET_REVIEWS_BY_BUSINESS } from '../../graphql/queries';
import { GET_OFFERS_BY_BUSINESS } from '../../graphql/queries';
import Loader from '../UI/Loader';
import ErrorMessage from '../UI/ErrorMessage';

const BusinessDashboard = () => {
  const navigate = useNavigate();
  
  // Get business profiles
  const { 
    loading: businessLoading, 
    error: businessError, 
    data: businessData 
  } = useQuery(GET_BUSINESS_PROFILES);
  
  // Get reviews and offers if a business exists
  const businessId = businessData?.getBusinessProfilesByOwner[0]?.id;
  
  const { 
    loading: reviewsLoading, 
    error: reviewsError, 
    data: reviewsData 
  } = useQuery(GET_REVIEWS_BY_BUSINESS, {
    variables: { businessId },
    skip: !businessId
  });
  
  const { 
    loading: offersLoading, 
    error: offersError, 
    data: offersData 
  } = useQuery(GET_OFFERS_BY_BUSINESS, {
    variables: { businessId },
    skip: !businessId
  });
  
  const loading = businessLoading || (businessId && (reviewsLoading || offersLoading));
  const error = businessError || reviewsError || offersError;
  
  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error.message} />;
  
  // Check if a business profile exists
  if (!businessData || businessData.getBusinessProfilesByOwner.length === 0) {
    return (
      <Container>
        <Card className="text-center p-5 shadow-sm">
          <Card.Body>
            <Card.Title as="h2">Welcome to the Business Dashboard</Card.Title>
            <Card.Text>
              You don't have a business profile yet. Create one to get started.
            </Card.Text>
            <Button 
              variant="primary" 
              size="lg" 
              onClick={() => navigate('/create-business')}
            >
              Create Business Profile
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }
  
  const business = businessData.getBusinessProfilesByOwner[0];
  const reviews = reviewsData?.getReviewsByBusiness || [];
  const offers = offersData?.getOffersByBusiness || [];
  
  // Calculate average rating
  const avgRating = business.averageRating || 0;
  
  // Get latest reviews
  const latestReviews = [...reviews].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  ).slice(0, 3);
  
  // Get active offers
  const activeOffers = offers.filter(offer => 
    !offer.endDate || new Date(offer.endDate) >= new Date()
  );
  
  // Calculate sentiment distribution
  const sentimentCounts = {
    Positive: reviews.filter(review => review.sentiment?.label === 'Positive').length,
    Neutral: reviews.filter(review => review.sentiment?.label === 'Neutral').length,
    Negative: reviews.filter(review => review.sentiment?.label === 'Negative').length
  };
  
  return (
    <Container>
      <h1 className="mb-4">Dashboard - {business.businessName}</h1>
      
      {/* Summary Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="shadow-sm h-100 transition-hover">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-1">Offers</h5>
                  <h2 className="mb-0">{offers.length}</h2>
                </div>
                <div className="d-flex align-items-center justify-content-center bg-primary text-white rounded-circle" style={{width: '48px', height: '48px'}}>
                  <FaShoppingBag />
                </div>
              </div>
              <div className="mt-3">
                <small className="text-muted">
                  {activeOffers.length} active offers
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="shadow-sm h-100 transition-hover">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-1">Reviews</h5>
                  <h2 className="mb-0">{reviews.length}</h2>
                </div>
                <div className="d-flex align-items-center justify-content-center bg-success text-white rounded-circle" style={{width: '48px', height: '48px'}}>
                  <FaCommentAlt />
                </div>
              </div>
              <div className="mt-3">
                <small className="text-muted">
                  {reviews.filter(r => r.responses && r.responses.length > 0).length} with responses
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="shadow-sm h-100 transition-hover">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-1">Rating</h5>
                  <h2 className="mb-0">{avgRating.toFixed(1)}</h2>
                </div>
                <div className="d-flex align-items-center justify-content-center bg-warning text-white rounded-circle" style={{width: '48px', height: '48px'}}>
                  <FaStar />
                </div>
              </div>
              <div className="mt-3">
                <div className="d-flex">
                  {[...Array(5)].map((_, i) => (
                    <FaStar 
                      key={i} 
                      className={`me-1 ${i < Math.round(avgRating) ? 'text-warning' : 'text-muted'}`}
                    />
                  ))}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="shadow-sm h-100 transition-hover">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-1">Sentiment</h5>
                  <h2 className="mb-0">
                    {reviews.length > 0 
                      ? (sentimentCounts.Positive / reviews.length * 100).toFixed(0) + '%'
                      : 'N/A'}
                  </h2>
                </div>
                <div className="d-flex align-items-center justify-content-center bg-info text-white rounded-circle" style={{width: '48px', height: '48px'}}>
                  <FaChartLine />
                </div>
              </div>
              <div className="mt-3">
                <small className="text-muted">
                  Positive sentiment
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Latest Reviews */}
      <Card className="mb-4 shadow-sm">
        <Card.Header className="d-flex justify-content-between align-items-center bg-white">
          <h5 className="mb-0">Latest Reviews</h5>
          <Button 
            variant="outline-primary" 
            size="sm"
            onClick={() => navigate('/reviews')}
          >
            View All
          </Button>
        </Card.Header>
        <Card.Body>
          {latestReviews.length > 0 ? (
            <div>
              {latestReviews.map(review => (
                <div key={review.id} className="border-bottom pb-3 mb-3">
                  <div className="d-flex justify-content-between">
                    <h6>{review.title}</h6>
                    <div className="d-flex">
                      {[...Array(5)].map((_, i) => (
                        <FaStar 
                          key={i} 
                          className={`me-1 ${i < review.rating ? 'text-warning' : 'text-muted'}`}
                          style={{ fontSize: '0.875rem' }}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted" style={{overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>{review.content}</p>
                  <div className="d-flex justify-content-between">
                    <div>
                      <span className={`badge ${
                        review.sentiment?.label === 'Positive' ? 'bg-success' : 
                        review.sentiment?.label === 'Negative' ? 'bg-danger' : 
                        'bg-secondary'
                      }`}>
                        {review.sentiment?.label}
                      </span>
                    </div>
                    <small className="text-muted">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                  {review.responses && review.responses.length > 0 ? (
                    <div className="mt-2 bg-light p-2 rounded small">
                      <strong>Your response:</strong> {review.responses[0].content}
                    </div>
                  ) : (
                    <div className="text-end mt-2">
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="p-0"
                        onClick={() => navigate('/reviews')}
                      >
                        <FaReply className="me-1" /> Respond
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted my-4">No reviews yet.</p>
          )}
        </Card.Body>
      </Card>
      
      {/* Quick Actions */}
      <Row>
        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex flex-wrap">
                <Button 
                  variant="outline-primary" 
                  className="me-2 mb-2"
                  onClick={() => navigate(`/business/${business.id}`)}
                >
                  View Business Profile
                </Button>
                <Button 
                  variant="outline-success" 
                  className="me-2 mb-2"
                  onClick={() => navigate('/offers/create')}
                >
                  Create New Offer
                </Button>
                <Button 
                  variant="outline-info" 
                  className="me-2 mb-2"
                  onClick={() => navigate('/reviews')}
                >
                  Manage Reviews
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BusinessDashboard;