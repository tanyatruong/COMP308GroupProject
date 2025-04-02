import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Container, Row, Col, Card, Form, Button, Tabs, Tab, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { GET_BUSINESS_PROFILES, GET_REVIEWS_BY_BUSINESS } from '../../graphql/queries';
import Loader from '../UI/Loader';
import ErrorMessage from '../UI/ErrorMessage';
import ReviewCard from './ReviewCard';
import SentimentAnalysis from './SentimentAnalysis';

const ReviewsList = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [filterRating, setFilterRating] = useState('all');
  const [sortBy, setSortBy] = useState('latest');

  // Get business profiles
  const { loading: businessLoading, error: businessError, data: businessData } = useQuery(GET_BUSINESS_PROFILES);
  
  // Get business ID
  const businessId = businessData?.getBusinessProfilesByOwner[0]?.id;

  // Get reviews
  const { loading: reviewsLoading, error: reviewsError, data: reviewsData, refetch } = useQuery(GET_REVIEWS_BY_BUSINESS, {
    variables: { businessId },
    skip: !businessId
  });

  const loading = businessLoading || reviewsLoading;
  const error = businessError || reviewsError;

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error.message} />;

  if (!businessId) {
    return (
      <Container>
        <ErrorMessage message="You need to create a business profile first." />
        <Button 
          variant="primary" 
          onClick={() => navigate('/create-business')}
          className="mt-3"
        >
          Create Business Profile
        </Button>
      </Container>
    );
  }

  const allReviews = reviewsData?.getReviewsByBusiness || [];

  // Filter reviews based on tab
  const filterReviews = () => {
    let filtered = [...allReviews];
    
    // Filter by response status
    if (activeTab === 'responded') {
      filtered = filtered.filter(review => review.responses && review.responses.length > 0);
    } else if (activeTab === 'needsResponse') {
      filtered = filtered.filter(review => !review.responses || review.responses.length === 0);
    }
    
    // Filter by rating
    if (filterRating !== 'all') {
      filtered = filtered.filter(review => review.rating === parseInt(filterRating));
    }
    
    // Sort reviews
    if (sortBy === 'latest') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === 'highest') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'lowest') {
      filtered.sort((a, b) => a.rating - b.rating);
    }
    
    return filtered;
  };

  const filteredReviews = filterReviews();
  const business = businessData.getBusinessProfilesByOwner[0];

  // Count reviews with no response
  const pendingResponseCount = allReviews.filter(
    review => !review.responses || review.responses.length === 0
  ).length;

  return (
    <Container>
      <h1 className="mb-4">Customer Reviews</h1>
      
      <Row className="mb-4">
        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <h5>Reviews Summary</h5>
              <Row className="text-center mt-3">
                <Col xs={4}>
                  <h3>{allReviews.length}</h3>
                  <div className="text-muted small">Total Reviews</div>
                </Col>
                <Col xs={4}>
                  <h3>{business.averageRating?.toFixed(1) || 'N/A'}</h3>
                  <div className="text-muted small">Average Rating</div>
                </Col>
                <Col xs={4}>
                  <h3>
                    {pendingResponseCount}
                    {pendingResponseCount > 0 && <Badge bg="danger" pill className="ms-1 fs-6">{pendingResponseCount}</Badge>}
                  </h3>
                  <div className="text-muted small">Pending</div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <SentimentAnalysis reviews={allReviews} />
        </Col>
      </Row>
      
      <Card className="shadow-sm">
        <Card.Header className="bg-white">
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-3"
          >
            <Tab eventKey="all" title={`All Reviews (${allReviews.length})`} />
            <Tab 
              eventKey="needsResponse" 
              title={
                <span>
                  Needs Response ({pendingResponseCount})
                  {pendingResponseCount > 0 && <Badge bg="danger" pill className="ms-1">{pendingResponseCount}</Badge>}
                </span>
              }
            />
            <Tab eventKey="responded" title="Responded" />
          </Tabs>
        </Card.Header>
        <Card.Body>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Filter by Rating</Form.Label>
                <Form.Select 
                  value={filterRating}
                  onChange={(e) => setFilterRating(e.target.value)}
                >
                  <option value="all">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Sort By</Form.Label>
                <Form.Select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="latest">Latest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest">Highest Rating</option>
                  <option value="lowest">Lowest Rating</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          
          {filteredReviews.length === 0 ? (
            <div className="text-center p-5">
              <h5 className="text-muted">No reviews found</h5>
              {activeTab === 'needsResponse' ? (
                <p>Great job! You've responded to all reviews.</p>
              ) : (
                <p>No reviews match your current filters.</p>
              )}
            </div>
          ) : (
            <div>
              {filteredReviews.map(review => (
                <ReviewCard 
                  key={review.id} 
                  review={review} 
                  onResponseAdded={() => refetch()}
                />
              ))}
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ReviewsList;