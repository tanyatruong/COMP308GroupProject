import React, { useState } from 'react';
import { Card, Badge, Button, Form } from 'react-bootstrap';
import { FaStar, FaReply } from 'react-icons/fa';
import { useMutation } from '@apollo/client';
import { RESPOND_TO_REVIEW } from '../../graphql/mutations';
import ReviewResponse from './ReviewResponse';

const ReviewCard = ({ review, onResponseAdded }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [response, setResponse] = useState('');
  
  const [respondToReview, { loading }] = useMutation(RESPOND_TO_REVIEW, {
    onCompleted: () => {
      setIsReplying(false);
      setResponse('');
      if (onResponseAdded) onResponseAdded();
    }
  });
  
  const handleSubmitResponse = (e) => {
    e.preventDefault();
    if (!response.trim()) return;
    
    respondToReview({
      variables: {
        input: {
          reviewId: review.id,
          content: response
        }
      }
    });
  };
  
  const getSentimentColor = () => {
    if (!review.sentiment) return 'secondary';
    
    switch (review.sentiment.label) {
      case 'Positive':
        return 'success';
      case 'Negative':
        return 'danger';
      case 'Neutral':
      default:
        return 'secondary';
    }
  };
  
  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h5 className="mb-1">{review.title}</h5>
            <div className="d-flex">
              {[...Array(5)].map((_, i) => (
                <FaStar 
                  key={i} 
                  className={`me-1 ${i < review.rating ? 'text-warning' : 'text-muted'}`} 
                />
              ))}
            </div>
          </div>
          <div>
            <Badge bg={getSentimentColor()}>
              {review.sentiment?.label || 'Neutral'}
            </Badge>
          </div>
        </div>
        
        <p className="mb-3">{review.content}</p>
        
        <div className="d-flex justify-content-between align-items-center mb-3">
          <small className="text-muted">
            Posted on {new Date(review.createdAt).toLocaleDateString()}
          </small>
        </div>
        
        {/* Display existing responses */}
        {review.responses && review.responses.length > 0 && (
          <div className="mb-3">
            {review.responses.map((resp, index) => (
              <ReviewResponse key={index} response={resp} />
            ))}
          </div>
        )}
        
        {/* Add response form */}
        {isReplying ? (
          <Form onSubmit={handleSubmitResponse}>
            <Form.Group className="mb-3">
              <Form.Label>Your Response</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Type your response here..."
                required
              />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button 
                variant="secondary" 
                size="sm" 
                className="me-2"
                onClick={() => setIsReplying(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                size="sm" 
                type="submit"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Submit Response'}
              </Button>
            </div>
          </Form>
        ) : (
          <div className="text-end">
            {(!review.responses || review.responses.length === 0) && (
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={() => setIsReplying(true)}
              >
                <FaReply className="me-1" /> Respond
              </Button>
            )}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default ReviewCard;