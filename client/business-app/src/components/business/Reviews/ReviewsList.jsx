import React, { useState } from 'react';
import { Card, Form, Button, Badge, Alert } from 'react-bootstrap';
import { format } from 'date-fns';
import { Star, StarFill } from 'react-bootstrap-icons';

const getSentimentColor = (sentiment) => {
  if (!sentiment) return 'secondary';
  
  switch(sentiment.toLowerCase()) {
    case 'very positive': return 'success';
    case 'positive': return 'info';
    case 'neutral': return 'secondary';
    case 'negative': return 'warning';
    case 'very negative': return 'danger';
    default: return 'secondary';
  }
};

const ReviewsList = ({ reviews, onRespondToReview }) => {
  const [responses, setResponses] = useState({});
  const [showResponseForm, setShowResponseForm] = useState({});

  const handleResponseChange = (reviewId, value) => {
    setResponses({
      ...responses,
      [reviewId]: value
    });
  };

  const toggleResponseForm = (reviewId) => {
    setShowResponseForm({
      ...showResponseForm,
      [reviewId]: !showResponseForm[reviewId]
    });
  };

  const submitResponse = (reviewId) => {
    if (responses[reviewId]?.trim()) {
      onRespondToReview(reviewId, responses[reviewId]);
      setResponses({
        ...responses,
        [reviewId]: ''
      });
      setShowResponseForm({
        ...showResponseForm,
        [reviewId]: false
      });
    }
  };

  if (!reviews || reviews.length === 0) {
    return (
      <Alert variant="info">
        No reviews yet. As customers review your business, they'll appear here.
      </Alert>
    );
  }

  // Sort reviews by date (newest first)
  const sortedReviews = [...reviews].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div>
      <Alert variant="info" className="mb-4">
        <div className="d-flex align-items-center">
          <div className="me-3">
            <span className="h5">💡</span>
          </div>
          <div>
            <strong>AI-Powered Sentiment Analysis</strong> is analyzing your customer reviews. 
            Use the sentiment indicators to quickly identify positive and negative feedback.
          </div>
        </div>
      </Alert>

      {sortedReviews.map((review) => (
        <Card key={review.id} className="mb-4">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <h5 className="mb-1">{review.title}</h5>
                <div className="mb-2">
                  {[...Array(5)].map((_, i) => (
                    i < review.rating 
                      ? <StarFill key={i} className="text-warning me-1" />
                      : <Star key={i} className="text-warning me-1" />
                  ))}
                </div>
              </div>
              
              {review.sentimentAnalysis && (
                <div className="mt-2">
                  <Badge 
                    bg={getSentimentColor(review.sentimentAnalysis)}
                    className="ms-2"
                  >
                    {review.sentimentAnalysis}
                  </Badge>
                </div>
              )}
            </div>
            
            <Card.Text>{review.content}</Card.Text>
            
            <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
              <small className="text-muted">
                By {review.author?.username || 'Anonymous'} on {' '}
                {format(new Date(review.createdAt), 'MMM d, yyyy')}
              </small>
              
            </div>

            {/* Previous responses */}
            {review.responses && review.responses.length > 0 && (
              <div className="mb-3">
                <h6>Your Responses:</h6>
                {review.responses.map((response, index) => (
                  <Card key={index} className="mb-2 bg-light">
                    <Card.Body className="py-2 px-3">
                      <small>{response}</small>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            )}

            {/* Response form */}
            {showResponseForm[review.id] ? (
              <div className="mt-3">
                <Form.Group>
                  <Form.Label>Your Response</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={responses[review.id] || ''}
                    onChange={(e) => handleResponseChange(review.id, e.target.value)}
                    placeholder="Write your response here..."
                  />
                </Form.Group>
                <div className="d-flex justify-content-end mt-2">
                  <Button 
                    variant="outline-secondary" 
                    size="sm" 
                    onClick={() => toggleResponseForm(review.id)}
                    className="me-2"
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    onClick={() => submitResponse(review.id)}
                  >
                    Submit Response
                  </Button>
                </div>
              </div>
            ) : (
              <Button 
                variant="outline-primary" 
                size="sm" 
                onClick={() => toggleResponseForm(review.id)}
              >
                {review.responses && review.responses.length > 0 
                  ? 'Add Another Response' 
                  : 'Respond to Review'}
              </Button>
            )}
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default ReviewsList;