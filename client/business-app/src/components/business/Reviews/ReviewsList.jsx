import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, Form, Alert, Row, Col, Container } from 'react-bootstrap';
import { format } from 'date-fns';
import { Star, StarFill } from 'react-bootstrap-icons';
import { useMutation, useQuery } from '@apollo/client';
import { GET_BUSINESS_PROFILE } from '../../../graphql/queries';
import { RESPOND_TO_REVIEW } from '../../../graphql/mutations';
import { useNavigate } from 'react-router-dom';

const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      i <= rating ? 
        <StarFill key={i} className="text-warning" /> : 
        <Star key={i} className="text-warning" />
    );
  }
  return <div className="d-flex">{stars}</div>;
};

const ReviewItem = ({ review, onRespondToReview }) => {
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [response, setResponse] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitResponse = async (e) => {
    e.preventDefault();
    if (response.trim()) {
      setSubmitting(true);
      try {
        await onRespondToReview(review.id, response);
        setResponse('');
        setShowResponseForm(false);
      } catch (error) {
        console.error("Failed to submit response:", error);
      } finally {
        setSubmitting(false);
      }
    }
  };

  const getSentimentBadgeColor = (sentiment) => {
    if (!sentiment) return 'secondary';
    switch (sentiment.toLowerCase()) {
      case 'positive': return 'success';
      case 'negative': return 'danger';
      case 'neutral': return 'warning';
      default: return 'secondary';
    }
  };

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <Card.Title>{review.title || 'Review'}</Card.Title>
            <div className="mb-2">
              <Badge 
                bg={getSentimentBadgeColor(review.sentimentAnalysis)} 
                className="me-2"
              >
                {review.sentimentAnalysis || 'No Sentiment'}
              </Badge>
            </div>
          </div>
          <StarRating rating={review.rating} />
        </div>

        <Card.Text>{review.content}</Card.Text>

        {review.responses && review.responses.length > 0 && (
          <div className="bg-light p-3 rounded mt-3 mb-3">
            <h6 className="mb-2">Your Response:</h6>
            <p className="mb-1">{review.responses[review.responses.length - 1]}</p>
          </div>
        )}

        {!showResponseForm && (!review.responses || review.responses.length === 0) && (
          <Button 
            variant="outline-primary" 
            size="sm" 
            onClick={() => setShowResponseForm(true)}
            className="mt-2"
          >
            Respond to Review
          </Button>
        )}

        {showResponseForm && (
          <Form onSubmit={handleSubmitResponse} className="mt-3">
            <Form.Group>
              <Form.Label>Your Response</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3}
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Type your response to this review..."
                required
              />
              <Form.Text className="text-muted">
                Your response will be visible to all customers
              </Form.Text>
            </Form.Group>
            <div className="d-flex justify-content-end mt-3">
              <Button 
                variant="outline-secondary" 
                size="sm" 
                className="me-2"
                onClick={() => setShowResponseForm(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                size="sm" 
                type="submit"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Response'}
              </Button>
            </div>
          </Form>
        )}
      </Card.Body>
    </Card>
  );
};

const ReviewStats = ({ reviews }) => {
  if (!reviews || reviews.length === 0) return null;
  const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const sentimentCounts = reviews.reduce((counts, review) => {
    const sentiment = review.sentimentAnalysis || 'Undefined';
    counts[sentiment] = (counts[sentiment] || 0) + 1;
    return counts;
  }, {});

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <h5 className="mb-3">Review Statistics</h5>
        <Row>
          <Col md={4} className="text-center mb-3 mb-md-0">
            <div className="h4 mb-0">{reviews.length}</div>
            <div className="text-muted">Total Reviews</div>
          </Col>
          <Col md={4} className="text-center mb-3 mb-md-0">
            <div className="h4 mb-0 d-flex align-items-center justify-content-center">
              {avgRating.toFixed(1)}
              <StarFill className="ms-1 text-warning" />
            </div>
            <div className="text-muted">Average Rating</div>
          </Col>
          <Col md={4} className="text-center">
            <div className="d-flex justify-content-center gap-2">
              {sentimentCounts['Positive'] && (
                <Badge bg="success" className="py-1 px-2">
                  {sentimentCounts['Positive']} Positive
                </Badge>
              )}
              {sentimentCounts['Negative'] && (
                <Badge bg="danger" className="py-1 px-2">
                  {sentimentCounts['Negative']} Negative
                </Badge>
              )}
              {sentimentCounts['Neutral'] && (
                <Badge bg="warning" className="py-1 px-2">
                  {sentimentCounts['Neutral']} Neutral
                </Badge>
              )}
            </div>
            <div className="text-muted mt-1">Sentiment Analysis</div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

const ReviewsList = ({ reviews: propReviews, onRespondToReview: propOnRespondToReview }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');
  const { loading: profileLoading, error: profileError, data: profileData, refetch: refetchProfile } = useQuery(GET_BUSINESS_PROFILE, {
    variables: { ownerId: userId },
    fetchPolicy: 'network-only',
    skip: Array.isArray(propReviews)
  });

  const [respondToReviewMutation] = useMutation(RESPOND_TO_REVIEW, {
    onCompleted: () => { if (!propReviews) refetchProfile(); },
    onError: (error) => setError(`Failed to respond to review: ${error.message}`)
  });

  useEffect(() => {
    if (Array.isArray(propReviews)) {
      setReviews(propReviews);
      setLoading(false);
      setError(null);
    } else if (profileData && profileData.businessProfileByOwner) {
      setReviews(profileData.businessProfileByOwner.reviews || []);
      setLoading(false);
      setError(null);
    } else if (profileLoading) {
      setLoading(true);
    } else if (profileError) {
      setError(profileError.message);
      setLoading(false);
    }
  }, [propReviews, profileData, profileLoading, profileError]);

  const handleRespondToReview = async (reviewId, response) => {
    try {
      if (propOnRespondToReview) {
        await propOnRespondToReview(reviewId, response);
      } else {
        await respondToReviewMutation({ variables: { reviewId, response } });
      }
      setReviews(reviews.map(review => review.id === reviewId ? {
        ...review,
        responses: [...(review.responses || []), response]
      } : review));
    } catch (error) {
      console.error("Error responding to review:", error);
      throw error;
    }
  };

  if (loading) {
    return <div className="text-center p-5">Loading reviews...</div>;
  }

  if (error) {
    return <Alert variant="danger" className="m-3">Error loading reviews: {error}</Alert>;
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center p-5">
        <p className="mb-4">You haven't received any reviews yet.</p>
        <p>Reviews from customers will appear here when they are submitted.</p>
      </div>
    );
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Customer Reviews</h3>
        <Button variant="outline-dark" onClick={() => navigate('/businessdashboard')}>Back to Dashboard</Button>
      </div>

      <ReviewStats reviews={reviews} />

      {reviews.map(review => (
        <ReviewItem 
          key={review.id} 
          review={review} 
          onRespondToReview={handleRespondToReview} 
        />
      ))}
    </Container>
  );
};

export default ReviewsList;